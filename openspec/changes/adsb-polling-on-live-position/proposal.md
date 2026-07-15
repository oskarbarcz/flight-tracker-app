## Why

On the cabin crew tracking dashboard, the map only starts polling the ADSB position feed once the flight goes off-block (status `TaxiingOut`). Crew who switch the transponder on during boarding get no confirmation that tracking works until the aircraft is already moving — too late to troubleshoot a bad transponder setup at the gate. Starting the feed as soon as the backend reports the aircraft's first live position lets crew verify ADSB during boarding, while there is still time to fix it.

## What Changes

- The tracking dashboard map polls the ADSB position feed **only** after a `flight.live-position-received` event has been received for the flight (and only within the active window, check-in through taxi-in). Polling the feed before the backend confirms a live position is pointless — the feed returns nothing — so the old off-block-based polling is removed as a start trigger.
- Introduce a new `flight.live-position-received` flight event, delivered over the existing Socket.IO `/flight-events` stream, signalling that the backend has observed the aircraft's first live position.
- Polling continues without interruption from that start through boarding into taxi-out, cruise, and taxi-in, and stops after arrival (`on_block`).
- Polling never starts before check-in, regardless of any event received.
- The new event is shown in the flight event timeline with a human-readable label.
- Replace the map's corner "Flight preview" chip with a solid top bar: left = a three-state **ADS-B status** indicator (gray "offline" before off-block, amber "offline" with a warning icon after off-block, green "online" when a live position is displayed); right = the existing share controls (open public map, copy link). The flight-history map reuses the same bar titled "Historic flight path" and shows no live telemetry.
- The Operations overview map and public map keep their existing status-based polling (they have no access to the event); only the cabin-crew tracking dashboard is event-gated.

## Capabilities

### New Capabilities

- `live-position-tracking`: Governs when the tracking dashboard begins and continues polling the ADSB position feed — the early start triggered by the first live-position event after check-in, and the preserved off-block fallback.

### Modified Capabilities

<!-- None. No existing spec covers ADSB polling; this behavior is captured as a new capability. -->

## Impact

- **`app/features/flight/model.ts`** — add `FlightEventType.LivePositionReceived = "flight.live-position-received"`; `shouldPollForAdsbData(status, hasLivePosition)` now returns true only when a live position has been received and the status is in the active window; add `isInFlightStatus(status)` for status-based callers (overview map).
- **`app/features/flight/i18n.ts`** — add a timeline label for the new event type (the exhaustive `Record<FlightEventType, string>` map forces this, and gates typecheck).
- **`app/features/flight/components/Dashboard/Tracking/Map/MapBox.tsx`** — derive `hasLivePositionReceived` from the tracked flight's events, feed it into the polling gate, and render the new `MapTopBar` (status + share links); telemetry moves below the bar.
- **New overlay components** — `Map/Box/Overlay/MapTopBar.tsx` (reusable solid bar), `AdsbStatusIndicator.tsx` (three-state status), `MapShareLinks.tsx` (extracted from the former `MapLinkOverlay`, now deleted). `LiveTelemetryOverlay.tsx` gains an optional position `className`.
- **`app/features/flight/components/Map/Box/HistoryFlightMap.tsx`** — replaces its "Historic data" chip with `MapTopBar` ("Historic flight path" + share links) and drops the live telemetry overlay.
- **`app/features/flight/components/Overview/RouteMap.tsx`** — polls via `isInFlightStatus` (status-based, unchanged behavior); it has no event access.
- **Backend dependency (separate repo, `flight-tracker-api`)** — must emit `flight.live-position-received` on the `/flight-events` Socket.IO namespace when it first observes the aircraft's live position. Until then the tracking dashboard shows "ADS-B offline" and does not poll.
