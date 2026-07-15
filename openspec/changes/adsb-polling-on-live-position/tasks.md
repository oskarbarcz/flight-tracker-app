## 1. New flight event type

- [x] 1.1 Add `LivePositionReceived = "flight.live-position-received"` to the `FlightEventType` enum in `app/features/flight/model.ts`.
- [x] 1.2 Add a `[FlightEventType.LivePositionReceived]: "Live position received"` entry to the `eventNames` map in `app/features/flight/i18n.ts` (the exhaustive `Record<FlightEventType, string>` makes typecheck fail until this exists).

## 2. Polling policy

- [x] 2.1 Change `shouldPollForAdsbData(status, hasLivePosition = false)` in `app/features/flight/model.ts` to return `hasLivePosition && liveTrackableStatuses.includes(status)` (`liveTrackableStatuses = [CheckedIn, BoardingStarted, BoardingFinished, TaxiingOut, InCruise, TaxiingIn]`) — no polling without the event, including after off-block.
- [x] 2.2 Add `isInFlightStatus(status)` (`[TaxiingOut, InCruise, TaxiingIn]`) and switch `RouteMap` (Operations overview) to it, preserving its status-based polling since it has no event access. Public `MapRoute` is untouched (does not use the helper).

## 3a. ADS-B status top bar

- [x] 3a.1 Add `MapTopBar` (reusable presentational solid bar: left `children`, right share links gated by `tracking !== Disabled`), `AdsbStatusIndicator` (green online / gray offline before off-block / amber offline+warning after off-block, shape-differentiated), and `MapShareLinks` (extracted from the deleted `MapLinkOverlay`).
- [x] 3a.2 Render `MapTopBar` in `MapBox` with `<AdsbStatusIndicator>`; give `LiveTelemetryOverlay` an optional position `className` and move it below the bar (`top-14`).
- [x] 3a.3 Render `MapTopBar` in `HistoryFlightMap` titled "Historic flight path" with share links; remove the live telemetry overlay from the history map.
- [x] 3a.4 Use the spelling "ADS-B" in all visible labels.

## 3. Tracking dashboard wiring

- [x] 3.1 In `app/features/flight/components/Dashboard/Tracking/Map/MapBox.tsx`, read `events` from `useTrackedFlight()` and derive `hasLivePositionReceived = events.some((e) => e.type === FlightEventType.LivePositionReceived)`.
- [x] 3.2 Pass `hasLivePositionReceived` into both `shouldPollForAdsbData(flight.status, hasLivePositionReceived)` checks (the initial-fetch effect and the interval effect) and add it to both effect dependency arrays so a live-arriving event starts polling without a page reload.

## 4. Verification

- [x] 4.1 Run `npm run typecheck` and `npm run lint` — both pass.
- [x] 4.2 With a checked-in flight in a boarding status, simulate/receive a `flight.live-position-received` event and confirm the tracking-dashboard map begins polling the ADSB feed before off-block. (Verified live: AAL4908 `checked_in` began polling `GET localhost:1080/api/v1/position/AAL4908` immediately after the event was delivered over the socket.)
- [x] 4.3 Confirm no polling without the event, even after off-block: AAL4911 `taxiing_out` with no event shows amber "ADS-B OFFLINE" and fires zero ADSB position requests (verified live).
- [x] 4.4 Confirm no polling before check-in even with the event: AAL4906 `ready` received the event — flight refetched but zero ADSB position requests (verified live).
- [x] 4.5 Confirm the `flight.live-position-received` event renders in the timeline with its "Live position received" label (verified live: Activity log, System scope, actor "ADSB feed").
- [x] 4.6 Confirm the three ADS-B bar states render correctly: gray offline (AAL4908 `checked_in`), amber offline (AAL4911 `taxiing_out`), green online (AAL4908 after event) — all verified live via screenshots.
- [x] 4.7 Confirm the history map shows the "Historic flight path" bar with share links and no telemetry (verified live at `/flight-history/:id` → Map tab).
- [x] 4.8 Confirm the Operations overview map still polls on status via `isInFlightStatus` (unchanged).
