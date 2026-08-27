# Operations postcard management

## Why

Pilots earn a postcard for each city they reach, and the art is drawn by a generator that
sometimes produces something unsuitable, sometimes fails outright, and never runs at all for
cities that arrive through a database migration. The API has offered operations everything
needed to supervise this — read every postcard, draw the missing ones, replace a bad one — but
the app exposes none of it. Nobody can see what the generator drew, so unsuitable art reaches
pilots and stays there.

## What Changes

- New Operations route `/postcards` and a sidebar entry, gated to the `operations` role like the
  rest of the section.
- The panel opens on the postcards that need attention — those whose art failed or is still being
  drawn — rather than on the whole catalogue, because the catalogue is large and most of it is fine.
- Postcards are grouped by country and filtered by continent, country and status. Country groups
  start collapsed, so the panel never loads hundreds of images at once.
- A bulk action queues art for every city that has none and every postcard whose art failed.
  Its result names the cities queued.
- A single postcard can be redrawn from a confirmation that states how many pilots already hold it.
  The confirmation sends no drawing options; it is one decision, not a form.
- While any postcard is being drawn the panel refreshes itself until none are, since the API
  answers before the art exists and never pushes.

## Capabilities

### New Capabilities

- `postcard-art-review`: Lets operations see every postcard's art, find the ones that need
  attention, give art to cities that have none, and replace art that is unsuitable.

### Modified Capabilities

None.

## Impact

- **New feature slice** `app/features/postcard/` — model, service, hooks, components, i18n.
- **New route** `routes/operations/postcards/PostcardsRoute.tsx`, registered in `app/routes.ts`
  under `OperationsLayout`, plus an entry in `OperationsSidebarItems`.
- **New service** `PostcardService` registered in `useApi()`.
- **Reuses** `CountryService` / `useCountries()` for the country-to-continent join, the existing
  `Continent` enum and `translateContinent`, and the catalogue toolbar, empty-state and container
  primitives already used by the cabin layout catalogue.
- **API endpoints consumed**: `GET /api/v1/postcard`, `POST /api/v1/postcard/draw-missing`,
  `POST /api/v1/postcard/{postcardId}/redraw`.
- **The API side has already been extended** for this panel (`flight-tracker-api`, change
  `add-city-postcards`): the catalogue now reports `statusChangedAt` and `failureReason` per
  postcard and `citiesWithoutPostcard` alongside them, and replacing art takes no parameters at all.
  One gap remains and is recorded in `design.md` — postcards carry no thumbnail, and producing one
  is generator or storage work rather than a change to the catalogue query.
- **Pilot-facing postcards are out of scope.** `GET /api/v1/user/me/postcard`,
  `GET /api/v1/user/me/postcard/{id}` and `POST /api/v1/user/me/postcard/{id}/seen` are untouched
  by this change.
