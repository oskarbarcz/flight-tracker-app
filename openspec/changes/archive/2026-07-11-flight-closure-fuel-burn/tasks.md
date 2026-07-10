## 1. Data & service layer

- [x] 1.1 In `app/features/flight/request.ts`, add `actualFuelBurned: number | null` to `ApiFlightResponse` and add a `CloseFlightRequest` type `{ actualFuelBurned: number }`.
- [x] 1.2 In `app/features/flight/model.ts`, parse and expose read-only `actualFuelBurned: number | null` on the `Flight` model from the API response.
- [x] 1.3 In `app/features/flight/service.ts`, change `close(id)` to `close(id, actualFuelBurned)` sending the `CloseFlightRequest` JSON body to `POST /api/v1/flight/{id}/close`, rounding the value with `Math.round(v * 1000) / 1000`.

## 2. Validation & form data

- [x] 2.1 In `app/features/flight/schema.ts`, add `closeFlightSchema` with `actualFuelBurned` required, `.moreThan(0)`, reusing the existing `maxThreeDecimals` test; label it in tons.
- [x] 2.2 In `app/features/flight/form-types.ts`, add `FlatCloseFlightFormData` (empty/initial value) and a mapper to the numeric `actualFuelBurned`.

## 3. Close form & modal

- [x] 3.1 Add `CloseFlightForm` under `app/features/flight/components/Forms/`, using `Form` + `ManagedFloatingInputBlock` (unit `t`) for the fuel-burn field, wired to `closeFlightSchema`.
- [x] 3.2 In the form, read `flight.loadsheets.final?.fuel?.trip` and render it read-only as planned trip fuel with a live `actual − plannedTrip` delta; omit the reference and delta when the final loadsheet or its `fuel` is absent.
- [x] 3.3 Add `CloseFlightModal` under `app/features/flight/components/Modal/`, wrapping `CloseFlightForm`, following the `UpdateFinalLoadsheetModal` structure; submit calls the context `close` callback with the entered value and uses `handleFormikApiError` for API errors.

## 4. Context wiring

- [x] 4.1 In `app/features/flight/hooks/useTrackedFlight.tsx`, change the `close` callback and context type to `(actualFuelBurned: number) => Promise<void>`, passing the value to `flightService.close` then reloading the flight.

## 5. Close button: form + delay guard

- [x] 5.1 In `CloseFlightButton.tsx`, add local `showModal` state so clicking Close opens `CloseFlightModal` instead of closing immediately; the close request fires only on form submit.
- [x] 5.2 Pull `delayRequest` from `useTrackedFlight()` and compute `hasUnsettledDelay = delayRequest !== null && !delayRequest.isSettled`; add it to the button's `disabled` alongside the existing `activeEmergency` guard, and prevent opening the modal while blocked.
- [x] 5.3 Add an informational `Tooltip` for the delay case (e.g. "Settle the delay before closing this flight."), preserving the existing emergency tooltip and its precedence when both conditions apply.

## 6. Verify

- [x] 6.1 Run `npm run lint` and `npm run typecheck`; fix any issues.
- [x] 6.2 Drive the pilot close flow in the app: confirm Close is disabled with a tooltip while a delay is unsettled and while an emergency is active, and enabled otherwise.
- [x] 6.3 Confirm the fuel-burn form requires a positive ≤3-decimal value, shows the planned trip reference and live delta, and that submit closes the flight and navigates to flight history.
