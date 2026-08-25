## 1. Capacity on the loadsheet form

- [x] 1.1 Bump the `package.json` version so `bin/check_version_is_free` passes
- [x] 1.2 Add `hooks/useCabinCapacity.ts` resolving the total seats of the flight aircraft's assigned layout, fetching the seat map only when a layout is assigned and returning no capacity rather than an error when it cannot be read
- [x] 1.3 Report the capacity against the passenger field in `LoadsheetLoadStep`, associated with the field for assistive technology rather than placed beside it
- [x] 1.4 Warn when the entered figure exceeds the capacity, conveying the warning by more than colour, and keep the form submittable
- [x] 1.5 Leave the form unchanged in every respect when no layout is assigned

## 2. Per-cabin split

- [x] 2.1 Add `passengersByCabin` to the preliminary loadsheet request type as optional, keyed by cabin as the layout names them
- [x] 2.2 Render a split field per cabin the assigned layout actually holds, rather than assuming a fixed set of classes
- [x] 2.3 Omit the key entirely when the split is untouched, never sending zeroes or an empty object
- [x] 2.4 Validate in `schema.ts` that a stated split sums to the passenger total, reporting both sums on disagreement
- [x] 2.5 Offer no split when the aircraft carries no cabin layout

## 3. Capacity refusals

- [x] 3.1 Add `lib/capacityRefusal.ts` recognising the unprocessable capacity response and distinguishing it from every other failure
- [x] 3.2 Report the refusal where the preliminary loadsheet is submitted, naming the passenger count, the seat count and the layout imposing the limit, and directing the reader to the loadsheet; consult the same helper from the release handler defensively
- [x] 3.3 Report the same refusal shape in `FinishBoardingButton` against the final loadsheet
- [x] 3.4 Leave unrelated failures reported as they are today, never attributed to capacity
- [x] 3.5 Ensure no surface shows the loadsheet as saved, or the flight as released or boarded, after a refusal

## 4. Reconciliation outcome

- [ ] 4.1 After boarding finishes, compare the manifest against the count it held before and report how many passengers were added and how many became no-shows
- [ ] 4.2 Report nothing when the count is unchanged
- [ ] 4.3 Report nothing for a flight whose aircraft carries no cabin layout

## 5. Verification

- [x] 5.1 Run `npm run lint` and `npm run typecheck` clean, with no comments and no `biome-ignore` added
- [x] 5.2 Verify against the live API that a loadsheet on a KLM 737-800 assigned `kl-738` reports 186 seats, and that a Lufthansa aircraft assigned `lh-74h` reports 364
- [x] 5.3 Verify a preliminary loadsheet refused for capacity names both figures, and that the loadsheet is not shown as saved
- [ ] 5.4 Verify finishing boarding refused for capacity behaves the same against the final loadsheet
- [x] 5.5 Verify an unrelated failure is not reported as a capacity problem
- [x] 5.6 Verify an untouched split omits the key from the request payload entirely, and that the resulting manifest is distributed proportionally
- [x] 5.7 Verify a stated split that does not sum to the total is caught before submission
- [x] 5.8 Verify a flight whose aircraft has no cabin layout shows no capacity, no warning, no split and no reconciliation report
- [ ] 5.9 Verify the reconciliation report against a final loadsheet both above and below the released count
- [x] 5.10 Check that the capacity hint and warning are announced with the passenger field, in light and dark, against WCAG 2.1 AA
- [x] 5.11 Run `npm run build`
