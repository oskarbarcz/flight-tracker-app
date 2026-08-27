# Tasks

## 1. Groundwork

- [x] 1.1 Make postcard art reachable in local development: add a `/mypreflight-files` proxy to `vite.config.ts` pointing at `http://localhost:8080`, and a helper that rewrites the stored docker-internal origin to that path when the browser cannot reach it. Confirm a seeded `imageUrl` renders. Nothing below can be judged until this works.
- [x] 1.2 Create the `app/features/postcard/` slice with `model.ts`, `service.ts`, `i18n.ts` and `index.ts`.
- [x] 1.3 Define `CataloguePostcard` (including `statusChangedAt` and `failureReason`), a `PostcardStatus` enum (`pending` / `ready` / `failed`), the catalogue response's `citiesWithoutPostcard`, and the `draw-missing` result type in `model.ts`, mirroring the API contract recorded in `design.md`.
- [x] 1.4 Add `translatePostcardStatus` to `i18n.ts` and wire it through `toHuman` (`app/i18n/translate.ts`) as the other slices do.
- [x] 1.5 Implement `PostcardService` extending `AbstractAuthorizedApiService` with `fetchCatalogue()`, `drawMissing()` and `redraw(id)`; have `redraw` send no request body and surface the `409` as a distinguishable outcome rather than a generic failure.
- [x] 1.6 Register `postcardService` in `useApi()` (`app/shared/api/useApi.tsx`) alongside the other authorized services.

## 2. Data layer

- [x] 2.1 Add a `usePostcardCatalogue()` hook that reads the catalogue once per visit and exposes the postcards, a loading state and a manual reload.
- [x] 2.2 Join postcards to countries inside the hook using the existing `useCountries()` (`app/features/country/hooks/useCountries`) to place each postcard on a continent, mapping the API's slug onto the existing `Continent` enum (`app/features/airport/model.tsx`) with a fallback for values it does not carry — the API returns `antarctica`, which it does not.
- [x] 2.4 Poll the catalogue while any postcard in the current response is `pending`, and stop once none is. Derive the condition from the data so it terminates on its own.

## 3. Filtering and grouping

- [x] 3.1 Add `lib/filterPostcards.ts` — pure filtering by a free-text search over city and country name, by country, and by status.
- [x] 3.2 Add `lib/groupPostcards.ts` — pure grouping into country groups ordered by country name, each carrying its count and how many of its postcards failed, plus a per-continent summary for the tab row.
- [x] 3.3 Hold filter state in the URL via `useSearchParams`, following `CabinLayoutsListRoute` — default the status filter to failed + pending, and treat clearing it as revealing the whole catalogue.
- [x] 3.4 Build `ContinentSelector` as a tab row offering every named continent with its count and a mark when one holds a failure, and `PostcardToolbar` with a `FilterInput` search over city and country name plus a country select, modelled on `CatalogueToolbar` (`app/features/cabin-layout/components/Catalogue/CatalogueToolbar.tsx`); include the same Clear affordance.
- [x] 3.5 Build the state strip above the continent tabs — one chip per state of the art carrying its own count and toggling on and off, plus a chip naming the cities that hold no postcard. Every chip behaves alike, none is inert, and the states are never summed into a combined figure or repeated as a select.

## 4. Presentation

- [x] 4.1 Build `PostcardCard` — the art, city, country and held count. Reserve the card's space from the API's `width` and `height`, and set `loading="lazy"` and `decoding="async"` on the image.
- [x] 4.2 Give `PostcardCard` its `pending` and `failed` states so neither renders as a broken image: a failed card reports its `failureReason`, and a card being drawn reports how long from `statusChangedAt`. Use `bg-gray-50` for the placeholder ground.
- [x] 4.3 Build `PostcardCountryGroup` over a shared `GroupHeaderButton`; a closed country renders its header only (flag, name, count, attention marker) and **no `img` element**, and the first country starts open.
- [x] 4.4 Page an opened country's cards with the flowbite `Pagination`, reporting which are shown of how many, so one large country cannot undo the image budget.
- [x] 4.5 Build the empty states with `ContainerEmptyState` — one quiet centred line, no icon and no call to action, since the filters that produced the empty result are still on screen.
- [x] 4.6 Extract any repeated wrapper into a named layout component rather than leaving bare `div` wrappers in the tree.

## 5. Actions

- [x] 5.1 Build `DrawMissingArtButton` with running and disabled states, preventing a second run while one is in flight.
- [x] 5.2 Build `DrawMissingResult` reporting how many cities were queued and naming them, stating the art appears as it is drawn; say so plainly when nothing needed queueing. Model it on `CatalogueRefreshResult` and use `Container`'s `header` prop for the card header.
- [x] 5.3 Word the control and its result so it is clear the action also retries postcards whose art failed, not only cities with no postcard at all.
- [x] 5.4 Build `RedrawPostcardModal` using `ModalTitle` and `ModalActions`, stating how many pilots hold the postcard and that their art is replaced without being revealed again. Send no request body.
- [x] 5.5 Offer replacement only on postcards that are not `pending`, and handle the `409` as a stated "already being drawn" outcome for the race the guard cannot prevent.
- [x] 5.6 Reload the catalogue after both actions so queued work appears as `pending` and polling takes over.

## 6. Route and navigation

- [x] 6.1 Add `routes/operations/postcards/PostcardsRoute.tsx` composing the strip, toolbar, groups and actions; set the page title with `usePageTitle` and the section header with `SectionHeaderWithButton`.
- [x] 6.2 Register `postcards` under `OperationsLayout` in `app/routes.ts`.
- [x] 6.3 Add the sidebar entry to `OperationsSidebarItems` (`app/shared/ui/Sidebar/Items/OperationsSidebarItems.tsx`), matching the icon language of the existing entries.
- [x] 6.4 Confirm the route is refused for non-operations roles the way the other operations routes are.

## 7. Verification

- [x] 7.1 Put any flowbite component overrides in `app/styles/theme.ts`, not in per-call `className` or `data-testid` selectors — including the `select` `sm` size, which had no override and so stood a few pixels shorter than the `sm` text input beside it.
- [x] 7.2 Check both light and dark themes against the WCAG 2.1 AA bar, and check the panel at mobile width.
- [ ] 7.3 Walk each spec scenario by hand against the local API. Done: a postcard held by a pilot, a stuck `pending`, a `failed` card and its reason, replacement end to end. Still to do: a real `409` from a concurrent replacement, and a city with no postcard at all (the seed has one city per postcard).
- [x] 7.7 Replace emoji country flags with bundled SVG assets (`app/assets/flags/`, MIT, one per API country code) behind a shared `CountryFlag`, so flags render alike on every platform.
- [x] 7.8 Open a postcard's art in a zoom modal carrying its facts and the replace action.
- [x] 7.4 Verify the image budget on a built app rather than `npm run dev`, which double-mounts: closed groups must issue no image requests, and opening one must load only that group's art.
- [x] 7.5 Run `npm run lint`, `npm run typecheck` and `npm run build`.
- [ ] 7.6 Bump the version in `package.json` before opening the PR (`bin/check_version_is_free` enforces it).
