# Design

## Context

See `proposal.md` — Why. The constraints that shape this design come from the API contract and
from the expected size of the catalogue.

The operations surface is three calls:

| Call | Answer |
| --- | --- |
| `GET /api/v1/postcard` | `{ postcards: CataloguePostcard[], citiesWithoutPostcard: CityRef[] }` — everything, unpaginated, unfiltered, unsorted |
| `POST /api/v1/postcard/draw-missing` | `{ queued, cities[] }` — queues work, returns before it is done |
| `POST /api/v1/postcard/{id}/redraw` | `204`, or `409` when the art is already being drawn |

A `CataloguePostcard` carries `id`, `city { id, name }`, `country { code, name }`, `imageUrl`,
`width`, `height`, `status` (`pending` / `ready` / `failed`), `statusChangedAt`, `failureReason`
and `heldBy`. The response also carries `citiesWithoutPostcard` — the cities holding no postcard at
all, which are named nowhere among the postcards themselves.

Three facts drive every decision below:

1. **The catalogue is expected to hold 500 or more postcards.** Cities derive from airports, and
   the airport table is the one that grows.
2. **There is no thumbnail.** Every `imageUrl` points at the full asset — the drawn size is
   1152×1536, and the seeded corpus is PNG. Rendering the whole catalogue at once would pull
   hundreds of megabytes.
3. **Nothing pushes.** Both write calls answer before the art exists, and there is no socket for
   postcards. The only way to learn an outcome is to read the catalogue again.

## Goals / Non-Goals

**Goals**

- Make the art visible at a size where "this is unsuitable" is a judgement operations can make.
- Keep the number of images in flight bounded no matter how large the catalogue grows.
- Keep the panel truthful about work that is queued but not yet done.

**Non-Goals**

- The pilot-facing postcard collection. Untouched by this change.
- Client-side sorting beyond the grouping described here. Grouping by country is the ordering.
- Any control over how the art is rendered. The API fixes the proportions, fidelity and format and
  exposes no way to vary them, so there is nothing here to build.

## Decisions

### The panel opens on what needs attention, not on the catalogue

Filtered to `failed` and `pending` on load; clearing the filters reveals the whole catalogue.

At 500+ postcards, "show me everything" is neither a useful default nor an affordable one. The two
real workflows are both narrow — *someone reported that one city's art looks wrong* (filter to the
country) and *check what the last deployment drew* (filter to the state). Landing on the exceptions
serves the second directly and costs the first one click.

*Alternative considered:* opening on the full catalogue, grouped and collapsed. More honest about
what the screen contains, but it makes the common task — finding the handful that failed — a
filtering exercise every single time.

### Continent narrows, countries collapse, search jumps

The panel has three ways in, each doing something the others cannot. A continent tab row narrows the
world to one region and always offers every continent the app names, even the empty ones, so the row
does not shift under the reviewer as filters change. Within it, postcards are grouped by country,
the first open and the rest closed — a closed country renders its header only and **no `img` element
at all**, which is what bounds how many images can be in flight without a thumbnail. Search jumps
straight to a known city, because a reviewer chasing "the Warsaw one looks wrong" should not have to
work out which continent Poland is on.

Continent was briefly tried as a third collapsible level, stacking every continent as an accordion.
That was worse: it still puts the whole world on one page and makes the reviewer guess which to
open. As tabs the choice is made once, up front.

### The states of the art are counted once

Each state — failed, being drawn — is a chip carrying its own count that toggles on and off, and the
panel opens with both on. There was briefly a fourth chip summing them as "needing attention", and a
select repeating the same choice. Both are gone. The sum restated two numbers already on screen, and
it was wrong on its face: a postcard mid-draw needs nothing from anyone, so calling it a thing
needing attention taught the reviewer to distrust the label.

The same reasoning governs the badges: a collapsed country and a continent tab report **failures**,
not failures-plus-drawings, because only a failure is a thing someone must act on.

Within an opened group, cards render with `loading="lazy"` and `decoding="async"`, and reserve
their space from the `width` and `height` the API already returns, so opening a large group does
not shift the layout as art arrives. A group larger than a set number of cards renders that many
and offers to show the rest, so a single country cannot undo the budget.

*Alternative considered:* virtualised windowing over a flat grid. Better for pure scrolling, but it
does not give operations the country-level overview the filters were asked for, and it is more
machinery for the same effect.

### Filtering, grouping and counting happen in the browser

The catalogue endpoint takes no query parameters, so every filter is applied to the one response.
At 500 postcards that response is roughly 200 KB of JSON — large but unremarkable, and read once
per visit.

This is only sound while the JSON stays small relative to the art. If the catalogue reaches a size
where the response itself is the problem, the fix is server-side filtering, not a cleverer client.

### Continent comes from the country service, not from a shipped table

`CataloguePostcard.country` carries only `code` and `name`. `GET /api/v1/country` returns all 249
countries with `code`, `name`, `flag` and `continent`, its continent slugs match the existing
`Continent` enum in `app/features/airport/model.tsx` exactly, and `CountryService` is already
registered in `useApi()` with a `useCountries()` hook in front of it.

So the panel reads both, joins on `country.code`, and gets continent grouping and flag emoji for
free. Nothing about ISO country data needs to be shipped in the frontend.

One value needs handling: the API also returns `antarctica`, which the `Continent` enum does not
have. Antarctic airfields are real, so a postcard can land there. An unmapped continent must group
under a plain fallback rather than crash the exhaustive `translateContinent` switch.

### The redraw confirmation is a modal, and sends no body

There is no operations-side endpoint for a single postcard — `/api/v1/user/me/postcard/{id}` is
pilot-scoped and deliberately answers `404` for a postcard the caller does not hold. A
`/postcards/:id` route would therefore have to refetch the entire catalogue to render one card.
A modal over the panel uses the row already in memory.

The confirmation sends no request body, because the endpoint accepts none. The city, its country
and its continent are facts the API already holds, and the proportions, fidelity and format are
fixed there. That keeps the replacement a single decision and removes Formik, a Yup schema and a
divisible-by-16 size validator from the change entirely. The confirmation's job is to state the
consequence — how many pilots hold the postcard, and that their art is replaced without a second
reveal.

### Local development reaches the art through a Vite proxy

The API stores `imageUrl` absolute, and in a local stack that address is docker-internal. Fixing it
on the API side would mean changing both `POSTCARD_ART_BASE_URL` and the seeded URLs, and the API's
own feature tests assert those seeded URLs — so the cost lands on the wrong repo.

Instead the app rewrites the stored origin to a relative path when it is one the browser cannot
reach, and the dev server proxies that path to `http://localhost:8080`. In production `imageUrl`
already points at a reachable host and the rewrite does nothing. The whole of it is one helper and
one proxy entry, and neither is reachable in a production build.

### The panel polls itself while art is being drawn, and only then

Both writes are asynchronous and nothing pushes, so the panel re-reads the catalogue on an interval
while any postcard in the current response is `pending`, and stops as soon as none is. The
condition is derived from the data rather than from a timer the UI sets, so it terminates on its
own: a queued postcard resolves to `ready` or `failed`, and either ends the polling.

This costs nothing at rest, which matters because operations leaves panels open.

*Alternative considered:* a manual refresh button. Honest and trivial, but it makes
`draw-missing` — which queues many cities at once — feel broken, because the panel would sit
unchanged for as long as the generator takes.

## Risks / Trade-offs

**No thumbnail exists, so a large opened group is heavy** → Closed-by-default groups, lazy loading,
reserved dimensions and a per-group cap keep it bounded. If the API later adds a `thumbnailUrl` to
`CataloguePostcard`, it is a source swap in one component and every mitigation above becomes
headroom rather than necessity. Worth raising with the API — it is the single change that would
most improve this panel.

**A city whose own name the generator refuses stays stuck** → The generator accepts only Latin
script for a city name, so a city imported under another script fails, `draw-missing` re-queues it,
and it fails again. Nothing in the panel can repair it, because the API deliberately offers no way
to draw a city under a different name. What the panel *can* do is stop it being a mystery: such a
postcard reports its `failureReason`, so the stuck city is visible and explained rather than an
unexplained red card. The repair, if one is ever wanted, belongs in the generator.

**`draw-missing` also retries failures, which its name does not say** → Its description covers
cities with no postcard *and* postcards whose art was never drawn or could not be drawn. The
control must be worded so operations knows it retries failures too, or failed postcards will be
redrawn one at a time when one action would do.

**A `409` is reachable even with the control disabled** → Replacement is offered only on postcards
that are not `pending`, but two operators, or a stale panel, can still race. The `409` is handled as
a stated outcome — "already being drawn" — not as an unexpected error.

**The catalogue response grows unbounded** → Acceptable at the expected size, and the failure mode
is gradual rather than sudden. Revisit if the city count moves toward four figures.

**Art needs an origin rewrite in local development** → `imageUrl` is stored absolute and
docker-internal, `http://functions-mock:1080/…`, which the browser cannot resolve. The same object
is served to the host at `http://localhost:8080/…`, because the `functions-mock` container publishes
`8080->1080`. A `/etc/hosts` alias does **not** work: host port 1080 belongs to the ADS-B mock. See
the decision below for how this is handled.

## Open Questions

- Can the API add a `thumbnailUrl` to `CataloguePostcard`? The design works without it, so this
  does not block the change or alter the task breakdown — it would let the per-group cap and the
  closed-by-default groups relax from necessities to conveniences. Note this is not a change to the
  catalogue query: the generator produces exactly one asset and has no resize step, so a thumbnail
  needs work in the generator or wherever the art is stored.
- Should the pilot-facing collection reuse these components when it is built? Likely, but the
  pilot surface is out of scope here and its shape is not yet decided.
