## 1. Shared notice primitives

- [x] 1.1 Extract the presentational condition row into a shared `NoticeCondition` component in the `Progress` folder, preserving the exact icon and colour treatment
- [x] 1.2 Extract the notice-panel shell into a shared `NoticePanel` component (tone `info`/`warning`/`neutral`, icon, title, description, optional conditions), reproducing the existing markup and colour tokens exactly
- [x] 1.3 Refactor `AutoTakeoffNotice` and `DelayNotice` onto `NoticePanel`/`NoticeCondition` with no change to their rendered output

## 2. Automatic off-block notice

- [x] 2.1 Create `AutoOffBlockNotice.tsx` in `app/features/flight/components/Dashboard/Tracking/Progress/`, returning `null` unless `flight.status === FlightStatus.BoardingFinished`
- [x] 2.2 Gate the notice on `hasLivePosition(events)` only (reuse the helper from `autoTakeoff.ts`); do not check the departure airport shape
- [x] 2.3 Render the `info` "Automatic off-block detection is active" state when a live position is present, with a satisfied "ADS-B signal acquired" condition
- [x] 2.4 Render the `warning` "Manual off-block report required" state when no live position is present, with the unmet "Awaiting ADS-B signal" condition

## 3. Panel wiring

- [x] 3.1 Render `AutoOffBlockNotice` in `FlightProgressBox.tsx` alongside `AutoTakeoffNotice`

## 4. Verification

- [x] 4.1 Run `npm run lint` and `npm run typecheck` clean
- [x] 4.2 Verify in-app: `boarding_finished` + live position shows the active off-block notice ("ADS-B signal acquired"); `boarding_finished` without a live position shows the manual notice ("Awaiting ADS-B signal"); the notice is hidden in `taxiing_out` and `checked_in`; the takeoff notice still renders through the shared panel; the manual "Report off-block" action stays available
