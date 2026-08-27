# Tasks

## 1. Data layer

- [x] 1.1 Extend `app/features/postcard/model.ts` with `MyPostcard` (`id`, `city`, `country`, `imageUrl`, `width`, `height`, `status`, `awardedAt`, `seenAt`) and `MyPostcardCollection` (`postcards`, `total`), mirroring the API contract recorded in `design.md`. Reuse the existing `PostcardStatus` enum.
- [x] 1.2 Add `MyPostcardService` to `app/features/postcard/service.ts` extending `AbstractAuthorizedApiService`, with `fetchMine()` and `markSeen(id)`. Keep it a separate class from `PostcardService` — different scope, and a `404` here means "you do not hold this", not a missing record.
- [x] 1.3 Register `myPostcardService` in `useApi()` (`app/shared/api/useApi.tsx`) alongside the other authorized services.
- [x] 1.4 Add `lib/collection.ts` — pure helpers over `MyPostcard[]`: keep only postcards whose art is ready, order by `awardedAt` descending, select those never seen, and derive the countries actually held. Every count on every surface comes from here, so the filtering rule lives in exactly one place.

## 2. Provider

- [x] 2.1 Add `hooks/usePostcards.tsx` — a context provider exposing the postcards whose art exists, `total`, the postcards waiting to be shown, a loading state, `acknowledge(id)` and a manual reload. It is the single owner of the unseen set, because the reveal fires from two routes and the badge is needed on every page.
- [x] 2.2 Have `acknowledge(id)` call `markSeen(id)` and move the provider's own state, so a postcard shown on the dashboard is not presented again after navigating to the archive. This is the sharpest edge in the change — see `design.md`, Risks.
- [x] 2.3 Swallow a failed `markSeen` without stopping the presentation, leaving the postcard reported as waiting on the next read.
- [x] 2.4 Refetch on mount and on window focus. Do not poll — nothing on the pilot's screen is waiting for the generator, since postcards without art are not shown.
- [x] 2.5 Mount `PostcardsProvider` in `routes/AppLayout.tsx` beside `useCurrentFlight()`, `useDataRefresh()`, `usePinnedAirports()` and `usePendingDelayCount()`.

## 3. The reveal

- [x] 3.1 Add the confetti keyframe to `app/styles/utilities.css`, which `index.css` imports — spread, drift, rotation and fall driven by CSS custom properties so one keyframe serves every particle. No canvas and no new dependency; `tw-animate-css` is already imported.
- [x] 3.2 Build `components/Ceremony/Confetti.tsx` — around forty absolutely-positioned elements with per-element custom properties, `aria-hidden`, unmounting when the animation ends, and rendering nothing at all under `prefers-reduced-motion`.
- [x] 3.3 Build `components/Ceremony/PostcardCeremony.tsx` — one burst on open, then the waiting postcards stepped through at full size, each naming its city, country and `awardedAt`, reporting which of how many is shown. Use `ModalTitle` / `ModalActions` and the themed modal chrome the app's other modals share.
- [x] 3.4 Acknowledge each postcard as it is presented, not when the ceremony opens, so closing at the first leaves the rest waiting.
- [x] 3.5 Verify under `prefers-reduced-motion` that the presentation, stepping and acknowledgement are unchanged and only the particles are gone.

## 4. The archive

- [x] 4.1 Build `components/Collection/PostcardTile.tsx` — the art, city, country flag and awarded date. Reserve the tile's space from the API's `width` and `height`, and set `loading="lazy"` and `decoding="async"`. Reuse `lib/artUrl.ts` and `CountryFlag`. No status placeholders are needed: only postcards whose art exists reach this component.
- [x] 4.2 Build `components/Collection/PostcardCountryFilter.tsx` — a select built from the countries actually held, never from all 249.
- [x] 4.3 Build `components/Collection/PostcardCollectionGrid.tsx` — one flat responsive grid, newest first, no grouping, no accordions, no paging.
- [x] 4.4 Let a tile open its postcard at full size in a modal carrying its facts, reusing the ceremony's presentation of a single postcard so the archive and the reveal render the same card.
- [x] 4.5 Build the empty state with `ContainerEmptyState` on `bg-gray-50` — say no postcard has arrived yet rather than that the pilot holds none, because they may hold several whose art does not exist.
- [x] 4.6 Extract any repeated wrapper into a named layout component rather than leaving bare `div` wrappers in the tree.

## 5. The dashboard box

- [x] 5.1 Build `components/Dashboard/PostcardsBox.tsx` on `Container` with the `header` prop and `CardHeader`, following `CurrentLocationBox` — `MetaRow` for the figures and `BoxFooter` for the link to the archive.
- [x] 5.2 Give it its three states: postcards waiting (how many, the cities named, and the action that opens the ceremony); none waiting (held against total, the most recent postcard, and the link only); and nothing held at all (one line stating that the cities the pilot reaches send them a postcard).
- [x] 5.3 Report the figure as `n of total` rather than as a percentage or a progress bar, so the number that moves is legible when `total` grows. Record why in the code's structure, not in a comment.
- [x] 5.4 Mount it in `routes/pilot/PilotDashboardRoute.tsx`'s right column, after `CurrentLocationBox` and before or after `RecentActivityBox`, with a loader consistent with the others.

## 6. Route and navigation

- [x] 6.1 Add `routes/pilot/postcards/MyPostcardsRoute.tsx` composing the grid, the country filter and the ceremony; set the page title with `usePageTitle` and the section header with `SectionHeader`.
- [x] 6.2 Register `my-postcards` under `PilotLayout` in `app/routes.ts`. The path is `/my-postcards` because `/postcards` belongs to the operations panel; the visible label is `Postcards`.
- [x] 6.3 Fire the ceremony on arriving at the route with postcards waiting, using the provider's set so a pilot who was already shown them on the dashboard is not shown them again.
- [x] 6.4 Add a `Collection` section with a `Postcards` entry to `CabinCrewSidebarItems`, passing the waiting count to the existing `badge` prop on `SidebarElement`.
- [x] 6.5 Add the same entry to `pilotSections` in `routes/common/MeRoute.tsx`, passing the waiting count to the existing `badge` prop on `MorePageItem`.
- [x] 6.6 Confirm the route is refused for non-pilot roles the way the other pilot routes are.

## 7. Verification

- [x] 7.1 Put any flowbite component overrides in `app/styles/theme.ts`, not in per-call `className` or `data-testid` selectors.
- [x] 7.2 Check both light and dark themes against the WCAG 2.1 AA bar, and check every surface at mobile width.
- [x] 7.3 Walk each spec scenario by hand against the local API: a postcard waiting, three waiting and stepped through, a ceremony closed at the first, a ceremony opened from the dashboard and then the archive visited, a held `pending` postcard, a held `failed` postcard, and a pilot holding nothing whose art exists.
- [x] 7.4 Verify the reveal fires exactly once per postcard across both entry points — open from the dashboard, then navigate to the archive, and confirm nothing is presented twice.
- [x] 7.5 Verify with the system set to reduced motion that no particle animates and everything else is unchanged.
- [x] 7.6 Run `npm run lint`, `npm run typecheck` and `npm run build`.
- [x] 7.7 Bump the version in `package.json` before opening the PR (`bin/check_version_is_free` enforces it).
