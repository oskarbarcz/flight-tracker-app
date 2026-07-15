## 1. Shape helper

- [x] 1.1 Add a `hasDestinationShape(flight)` helper to `autoTakeoff.ts`, sibling to `hasDepartureShape`, returning true when `flight.destinationAirport?.shape` has at least three points

## 2. Automatic arrival notice

- [x] 2.1 Create `AutoArrivalNotice.tsx` in `app/features/flight/components/Dashboard/Tracking/Progress/`, returning `null` unless `flight.status === FlightStatus.InCruise`
- [x] 2.2 Gate availability on `hasDestinationShape(flight) && hasLivePosition(events)`
- [x] 2.3 Render the `info` "Automatic arrival detection is active" state when both hold, via `NoticePanel`, with satisfied conditions "Destination airport mapped" and "ADS-B signal acquired"
- [x] 2.4 Render the `warning` "Manual arrival report required" state otherwise, naming each unmet condition ("Destination airport not mapped" / "Awaiting ADS-B signal") with the met one shown as satisfied

## 3. Panel wiring

- [x] 3.1 Render `AutoArrivalNotice` in `FlightProgressBox.tsx` alongside the takeoff and off-block notices

## 4. Verification

- [x] 4.1 Run `npm run lint` and `npm run typecheck` clean
- [x] 4.2 Verify in-app: an `in_cruise` flight with a mapped destination + live position shows the active arrival notice; without a shape or without a live position shows the manual notice naming the unmet condition; the notice is hidden outside `in_cruise`; the manual "Report arrival" action stays available; the notice stacks cleanly with the in-cruise delay notice
