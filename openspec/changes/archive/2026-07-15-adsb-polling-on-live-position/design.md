## Context

The tracking dashboard map (`MapBox`) polls the ADSB position feed every 5s while `shouldPollForAdsbData(flight.status)` returns true. Today that helper returns true only for `TaxiingOut`, `InCruise`, and `TaxiingIn` — so the map is dark until the flight is off-block. Cabin crew turn the transponder on during boarding but get no confirmation it works until the aircraft moves.

Real-time flight events already arrive over a Socket.IO `/flight-events` namespace (`events.socket.ts`), are prepended into `useTrackedFlight` state, and are exposed as `events`. `parseEvent` is a passthrough that tolerates any event type, and `FlightEvent.payload` is `Record<string, unknown>`, so a new event type needs no socket- or parse-layer change. Event labels are centralized in `i18n.ts` via an exhaustive `Record<FlightEventType, string>`.

The backend (separate repo) will emit a new `flight.live-position-received` event when it first observes the aircraft's live position. This design covers the frontend consumption of that signal.

## Goals / Non-Goals

**Goals:**

- Start ADSB polling on the tracking dashboard during boarding, as soon as a live position has been received, so crew get immediate feedback that ADSB works.
- Preserve today's off-block start as a fallback when no live-position event arrives.
- Never poll before check-in, and stop polling after arrival as before.
- Keep polling policy centralized and testable; avoid scattering conditions into components.

**Non-Goals:**

- Changing the polling interval or the ADSB feed/service.
- Event-gating the overview map or the public map (they keep status-based polling; they have no event access).
- Defining the backend event payload or emission logic (separate repo).

## Decisions

### Derive the signal from events, not ephemeral state

`hasLivePositionReceived` is computed from the tracked flight's `events` — `events.some(e => e.type === FlightEventType.LivePositionReceived)` — not from a boolean toggled in the socket `onEvent` handler.

- **Why:** The event history is reloaded on mount (`onHistory`), so a derived flag survives page reloads and reconnects with zero extra state and a single source of truth. It also updates live, because new events are prepended into `events`.
- **Alternative rejected:** A local `useState` boolean set on the socket event — lost on reload, so after a refresh mid-boarding the map would wrongly go dark until off-block.

### The live-position event is mandatory for polling — no off-block fallback

`shouldPollForAdsbData(status, hasLivePosition = false)` returns `hasLivePosition && liveTrackableStatuses.includes(status)`, where `liveTrackableStatuses = [CheckedIn, BoardingStarted, BoardingFinished, TaxiingOut, InCruise, TaxiingIn]`. Without the event it returns false for every status — including off-block.

- **Why:** Polling the ADSB feed by callsign before the backend confirms a live position is pointless; the feed returns nothing, so status-based polling just wastes requests. The event is the only signal that polling is worthwhile. The upper bound (stops at `on_block`) prevents indefinite polling on completed/historical flights.
- **Overview map (`RouteMap`) keeps status-based polling.** It lives on the Operations side, takes a `flight` prop, and has no access to the flight-events socket, so it cannot know the event. It calls the new `isInFlightStatus(status)` helper (`[TaxiingOut, InCruise, TaxiingIn]`) — exactly its previous behavior. Making the shared function event-gated would silently stop Operations polling, so the status predicate is split out for that caller.
- **Alternatives rejected:** (a) keeping an off-block fallback — the whole point is that it is pointless; (b) wiring the event socket into the Operations overview — scope creep for a surface the user did not ask to change.

### One reusable solid top bar, presentational

`MapTopBar` is a presentational shell (`children` on the left, share links on the right) rendered as a solid `bg-white dark:bg-gray-900` strip with a hairline bottom border, clipped to the map container's rounded corners. The tracking dashboard passes `<AdsbStatusIndicator>` as its left content; the history map passes a "Historic flight path" title. Share links are shown only when `flight.tracking !== Disabled`.

- **Why:** Both surfaces need the same bar with different left content and different data sources (dashboard reads context; history takes a `flight` prop). A presentational shell keeps one layout and lets each caller supply its own left content and share gating. The former `MapLinkOverlay` becomes `MapShareLinks` (positioning removed).
- **Status states use shape, not just colour.** Online = green pulsing dot; offline-before-off-block = gray dot; offline-after-off-block = amber warning triangle. Gray and offline-after share the word "ADS-B offline", so the dot-vs-triangle distinction carries the meaning for colour-blind users (WCAG: never colour alone). The green pulse is `animate-ping` with a `motion-reduce` fallback.
- **Telemetry** moves below the bar on the live dashboard (`top-14`); the history map drops it entirely (a completed flight has no live telemetry to show).

### New event flows through the existing socket path

`flight.live-position-received` is added as an ordinary `FlightEventType`. It is delivered via the existing `flight.event` → `onEvent` → prepend path. No new `socket.on` listener and no change to `FlightEventsListeners`.

- **Why:** `parseEvent` and `payload: Record<string, unknown>` already handle arbitrary events; a discrete "first position seen" signal is an event, not a new stream. The ADSB feed remains the position source.
- **Alternative rejected:** A dedicated socket channel/listener for positions — unnecessary surface for a one-shot signal.

### Timeline label is mandatory, not optional

`translateEventType` uses `Record<FlightEventType, string>`, so adding the enum member is a compile error until a label ("Live position received") is added. This is enforced by typecheck rather than left to discretion.

### Effects react to the derived flag

`MapBox`'s two polling effects read `hasLivePositionReceived`, feed it into `shouldPollForAdsbData`, and include it in their dependency arrays, so a live-arriving event re-runs the effect and starts the 5s interval without a reload. `fetchFlight` stays memoized (existing `useCallback`), so no new interval churn is introduced beyond the re-run that already happens on each event.

## Risks / Trade-offs

- **Backend event not yet emitted** → The tracking dashboard shows "ADS-B offline" and does not poll (gray before off-block, amber after). This is a visible behavior change from today's off-block polling, and is intended: without the event there is nothing worth polling. It activates the moment the backend ships the event.
- **Event arrives but the ADSB feed has no position for the callsign yet** → The map polls but the status stays "offline" (no live position displayed) until the first point arrives, then flips to green "online". Honest: the bar reflects whether a position is actually shown.
- **Earlier polling adds network cost during boarding** → Bounded to the post-check-in window, unchanged 5s interval, and only on the tracking dashboard the crew is actively viewing.
- **Effect re-runs recreate the interval** → The effect already re-runs on every event today (a silent flight reload changes the `flight` reference); adding a boolean dependency introduces no new class of churn.

## Migration Plan

Frontend change with no data migration. Deploy independently of the backend; until the backend emits `flight.live-position-received`, the tracking dashboard shows "ADS-B offline" and does not poll (a deliberate, visible change from today's off-block polling). Rollback is a straight revert of the FE commit — there is no persisted state to unwind.

## Open Questions

- Should the overview map eventually adopt the same early start for consistency? Deferred; out of scope per the current request.
- Is an explicit "awaiting live position" indicator during the early window worth adding as a follow-up UX task?
