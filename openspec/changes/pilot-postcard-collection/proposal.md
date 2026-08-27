# Pilot postcard collection

## Why

A pilot earns a postcard for every city they reach, and the API has offered them back since the
postcards were built — the collection, one postcard, and an acknowledgement that ends its reveal.
The app asks for none of it. Operations can now see and repair the art, but the people the art was
drawn for cannot see it at all. Every postcard drawn so far has been drawn for nobody.

`MyPostcard` carries `seenAt`, and `POST /user/me/postcard/{id}/seen` exists to set it. The API
models "this pilot has never been shown this postcard" as first-class state and offers the means to
end it. That is not a field to read and display; it is a mechanic to build.

## What Changes

- New pilot route `/my-postcards` — the archive: every postcard the pilot holds, newest first,
  narrowed by country.
- A `Postcards` dashboard box in the pilot dashboard's right column, alongside Current location and
  Recent activity, reporting how many postcards wait and how many the pilot holds of the total.
- A new `Collection` sidebar section and a matching `/me` more-page row, both carrying the count of
  postcards waiting as a badge, as `/delays` does for operations.
- **The collection holds only postcards whose art exists.** A postcard being drawn and a postcard
  whose art failed are both absent — a pilot cannot act on either, and neither has anything to show.
- **A postcard arrives celebrated.** A postcard the pilot has never been shown is presented once, at
  full size, with a single burst of confetti — then it joins the archive and the archive stays calm.
  Because unseen postcards are the only ones that enter this way, the reveal is the mechanism by
  which every postcard enters the collection, not a garnish on top of it.
- The reveal fires from both surfaces — the dashboard box and arriving at the archive — so a pilot
  who never opens the dashboard is never silently robbed of it.
- Postcards are read through a provider mounted in `AppLayout`, because the badge needs the count on
  every page and the reveal needs one owner across two routes.

## Capabilities

### New Capabilities

- `pilot-postcard-collection`: Lets a pilot see the postcards the cities they reached sent them, be
  shown each new one once, and keep the rest as an archive.

### Modified Capabilities

None. `postcard-art-review` is untouched — operations keeps every state of the art, including the
two this change hides from pilots.

## Impact

- **Extends the existing slice** `app/features/postcard/` — the pilot surface is a second face on
  the same domain, not a second slice.
- **New route** `routes/pilot/postcards/MyPostcardsRoute.tsx`, registered under `PilotLayout` in
  `app/routes.ts`. The path is `/my-postcards` because `/postcards` belongs to the operations panel
  under `OperationsLayout`; the visible label stays `Postcards`.
- **New provider** `usePostcards()`, mounted in `routes/AppLayout.tsx` beside `useCurrentFlight()`,
  `useDataRefresh()`, `usePinnedAirports()` and `usePendingDelayCount()`.
- **New service** `MyPostcardService` registered in `useApi()` — pilot-scoped, separate from
  `PostcardService`, which is operations-scoped and stays as it is.
- **Reuses** `lib/artUrl.ts` (the dev origin rewrite), the dashboard `Container` / `CardHeader` /
  `MetaRow` / `BoxFooter` primitives, `CountryFlag`, and the existing `badge` prop already present on
  `SidebarElement` and `MorePageItem` — no new badge component.
- **API endpoints consumed**: `GET /api/v1/user/me/postcard`,
  `POST /api/v1/user/me/postcard/{postcardId}/seen`. `GET /api/v1/user/me/postcard/{postcardId}` is
  not needed — the collection response carries every field the archive and the reveal render.
- **No new dependency.** `tw-animate-css` is already imported in `app/styles/index.css`; the
  confetti is a handful of elements over one keyframe.
- **Out of scope**: `GET /api/v1/user/me/stats/cities`, which would let the app name the cities a
  pilot reached that sent no postcard. It stays unconsumed. That gap is an operations problem and
  naming it here would hand the pilot something only operations can fix.
