# Design

## Context

See `proposal.md` — Why. The pilot surface is three calls, one of which is not needed:

| Call | Answer |
| --- | --- |
| `GET /api/v1/user/me/postcard` | `{ postcards: MyPostcard[], total: number }` — only what the caller holds, plus how many exist in the world |
| `POST /api/v1/user/me/postcard/{id}/seen` | `204`. "Ends the reveal for this postcard so it is presented once." Acknowledging one already seen changes nothing |
| `GET /api/v1/user/me/postcard/{id}` | `MyPostcard`, or `404` for one the caller does not hold. Not used — the collection response already carries every field |

A `MyPostcard` carries `id`, `city { id, name }`, `country { code, name }`, `imageUrl`, `width`,
`height`, `status` (`pending` / `ready` / `failed`), `awardedAt` and `seenAt`.

Four facts shape everything below:

1. **`seenAt` is nullable and there is an endpoint to set it.** The API models an unseen postcard as
   state and offers the means to end it. Ignoring that would be building less than the API offers.
2. **The unearned cities are unnamed.** "Cities the caller has not reached are not named." Progress
   can only ever be a fraction; there is no checklist to render and no silhouette to tease.
3. **A held postcard may have no art.** `status` is on `MyPostcard`, not only on the operations
   catalogue. A pilot can hold a postcard that is still being drawn, or one that failed and — where
   the generator refuses the city's name — will keep failing.
4. **The product register is hostile to this feature's genre.** `PRODUCT.md`: *never chatty or
   gamified*, *no theatrical chrome*, *procedural realism, not theater*. A collectible with a
   celebration is, on its face, the thing that document warns against.

## Goals / Non-Goals

**Goals**

- Show the pilot the art that was drawn for them, at a size where it is worth looking at.
- Spend the reveal `seenAt` makes possible, once, deliberately, per postcard.
- Keep the archive calm. Every surprise happens on arrival, never on a revisit.

**Non-Goals**

- Naming the cities the pilot has not reached. The API withholds them deliberately.
- Naming the cities the pilot reached that sent no postcard. Out of scope; see `proposal.md`.
- Any control over the art. The pilot cannot redraw, reject or reorder it. That is operations' panel.
- Sorting and grouping beyond newest-first and a country filter. See the decision below.

## Decisions

### The collection holds only postcards whose art exists

`pending` and `failed` postcards are filtered out of the archive, out of the counts and out of the
badge. When art lands, the postcard appears — and because `seenAt` is still null, it appears
*through the reveal*.

This began as two separate answers and collapsed into one. Hiding a failed postcard is obvious: the
generator refuses some city names outright, so a pilot would otherwise hold a permanently broken tile
reporting a problem only operations can fix. Once failures are hidden, a `pending` postcard has no
better claim to be present — a spinner the pilot cannot act on is the same non-information as a
broken tile, and it invites them to wait on something that may never resolve.

The rule earns more than it costs. The reveal stops being decoration and becomes the only door into
the collection: nothing ever arrives quietly. An operations redraw of a failed postcard lands as a
late arrival and is correctly celebrated, because `seenAt` was never set. And the pilot side needs
none of the operations slice's status placeholders — the art component reduces to an image, a
reserved box and the origin rewrite.

*Alternative considered:* showing `pending` as "being drawn" and `failed` as unavailable, mirroring
the operations panel. Honest in the way the rest of the product is honest, and rejected because it
is honest about the wrong audience's problem. Operations has a panel that reports every state with
its reason; the pilot has no action to take and no reason to be told.

### The reveal is a single burst, then a walk

Confetti fires once when the reveal opens. The waiting postcards are then stepped through at full
size — `1 of 3`, and forward — each acknowledged **as it is presented**, not when the reveal opens.

Acknowledging on open would be simpler and would burn reveals the pilot never saw. Acknowledging on
presentation makes closing at `1 of 3` leave two waiting and the badge read two, which is what
"presented once" actually means. A postcard that was never on screen was never presented.

One burst rather than one per postcard: repeated bursts cheapen within seconds, and a pilot returning
from a break holding eight postcards should not have to sit through eight celebrations. The
celebration marks the arrival of mail, not the count of it.

*Alternative considered:* fanning all of them out together in one spread. Faster, and it scales, but
each postcard is then seen small — and the art having the screen to itself is the entire point.

### The reveal fires from the dashboard box and from the archive

Both, which forces the postcards out of route state and into a provider.

The dashboard box is the natural arrival surface — it sits where a pilot already looks after closing
a flight, beside Current location. But a pilot who works from the sidebar and never returns to the
dashboard would reach the archive with postcards they had never been shown, and rendering them into
the grid would spend every reveal at thumbnail scale. So arriving at the archive with unseen
postcards fires the same reveal over the same component.

Two surfaces mean the unseen set cannot be route-local: open three from the box, navigate to the
archive, and it must not fire again. That is the sharpest edge in this change and the most likely
bug — `acknowledge(id)` must move the provider's state, not just the open reveal's.

This cost is smaller than it looks, because the badge needs the same thing. `SidebarElement` and
`MorePageItem` both already take a `badge`, and a badge is needed on every page — exactly the
argument that put `usePendingDelayCount()` in `AppLayout`. Two independent decisions land on one
provider, mounted on the shelf that already holds four.

### The archive is flat, newest first, with a country filter

No continent tabs and no collapsed country accordions, both of which the operations panel needs and
this one does not.

The operations panel's machinery exists because the catalogue is expected to hold 500 or more
full-size images with no thumbnail available. A pilot holds tens. The constraint that justified
closed-by-default groups and per-group paging mostly evaporates, and carrying it over would be
building a budget for a bill nobody is going to receive. `loading="lazy"`, `decoding="async"` and
space reserved from the API's `width` and `height` remain — those cost nothing and still pay.

Newest first because the postcard a pilot wants is the one that just arrived. A country select built
from the postcards actually held — not from all 249 countries — keeps "show me Poland" working at
forty cards without implying a country the pilot has never flown to.

*Alternative considered:* grouping by country, which would reuse `groupPostcards` and the
`useCountries` join outright. Real reuse, and it turns the archive into a map of where the pilot has
been — but country groups of one card each look thin, and it buries the newest arrival in the middle
of the page.

### Postcards are refetched on mount and on focus, never polled

The operations panel polls because it is watching work it started. The pilot is not: nothing on their
screen is waiting for the generator, since postcards without art are not shown. An interval would be
requests at rest for a page that cannot change while it is being read.

The cost is that a pilot sitting on the dashboard when the art finishes drawing does not see it
arrive. Refetching on mount and on window focus covers every way they would notice — coming back to
the tab, navigating, reopening the app — without a timer.

### The celebration honours `prefers-reduced-motion`, and is not negotiable

`PRODUCT.md` sets WCAG 2.1 AA and requires animation to honour the preference. Under it the reveal is
identical in every respect except that no particle moves: the postcard is still presented at full
size, still stepped through, still acknowledged. The confetti is the only thing that is optional,
which is the correct division — the reveal carries the information, the particles carry the mood.

The confetti itself is around forty absolutely-positioned elements, their spread, drift, rotation and
delay set as CSS custom properties per element, animated by one keyframe in `app/styles/index.css`,
unmounted when it ends. No canvas, no library. `tw-animate-css` is already imported.

### `MyPostcardService` is a separate class from `PostcardService`

Different scope, different endpoints, different failure meaning — a `404` from the pilot endpoints is
a deliberate "you do not hold this", not a missing record. Both extend
`AbstractAuthorizedApiService` and both register in `useApi()`. Merging them would put operations-only
methods on the object the pilot surface holds.

## Risks / Trade-offs

**The denominator is not quite the numerator's world** → `total` counts every postcard that exists,
including those whose art failed; the numerator counts only the pilot's postcards whose art exists.
`37 of 214` is therefore very slightly apples-to-oranges. It is undetectable from the pilot's side and
the API offers no narrower total, but it is the only figure on the surface and *trust the numbers* is
the product's first principle. Accepted, and recorded rather than hidden.

**The fraction can fall while the pilot flies** → `total` grows whenever operations adds an airport
in a new city. A pilot who flies nowhere new can watch their share shrink. Reporting it as `37 of 214`
rather than as a percentage or a progress bar keeps the movement legible: the number that changed is
the one that changed.

**The reveal has two entry points and one state** → The likeliest defect in this change is a double
reveal. Mitigated by keeping the unseen set in the provider, acknowledging through the provider, and
never deriving "what is unseen" inside either surface.

**A celebration in a product that forbids theatre** → This was raised against `PRODUCT.md` and
decided deliberately: postcards are the one artifact here that is not a number, and the product's
anti-theatre rule was written about instrument chrome, not about the arrival of mail. The line held is
that the celebration happens **only on arrival, only once, only where the pilot asked for it** — and
the archive, the dashboard box at rest and every other surface stay exactly as terse as the rest of
the app. If the mechanic is later judged wrong, it detaches at one component.

**A pilot may hold postcards and see an empty collection** → Every one of their postcards could be
`pending` or `failed`. The empty state must therefore not claim they have none; it says no postcard
has arrived yet, which is true either way.

## Open Questions

- Should the reveal be reachable again on purpose — a way to re-see a postcard's arrival? The API
  cannot support it: `seenAt` only moves forward. Any such thing would be a client-side replay, and
  it is not proposed here.
- If the API later adds a `thumbnailUrl`, the archive's tiles should use it. Nothing in this design
  depends on its absence, unlike the operations panel.
