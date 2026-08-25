## 1. Manifest types and service

- [x] 1.1 Bump the `package.json` version so `bin/check_version_is_free` passes
- [x] 1.2 Add `FlightManifest` and `ManifestPassenger` to `app/features/cabin-layout/model.ts`, with `ssr` nullable
- [x] 1.3 Add the enums `PassengerStatus` (`boarded`, `no_show`) and `SsrCode` (`INFT`, `WCHR`, `WCHS`, `WCHC`, `UMNR`, `BLND`, `DEAF`, `MAAS`, `PETC`), and translate each in `i18n.ts` to the requirement in words rather than the abbreviation
- [x] 1.4 Add `fetchManifest(flightId, status?)` to `FlightService`, omitting the query parameter when no status filter is active
- [x] 1.5 Add `hooks/useFlightManifest.ts` fetching the manifest and, when its revision permits, the seat map — resolving the two independently so a failed seat map never withholds the passenger list
- [x] 1.6 Map the three absent-manifest responses to distinct, discriminable states rather than a single error, resolving the no-cabin-layout case from the flight itself rather than from the response

## 2. Occupancy in the seat diagram

- [x] 2.1 Add `lib/seatOccupancy.ts` indexing passengers by deck and designator together, not by designator alone
- [x] 2.2 Add an occupancy appearance resolver to `lib/seatAppearance.ts` giving free, occupied and no-show seats distinct treatments encoded by more than colour, changing neither `Seat` nor `DeckCanvas`
- [x] 2.3 Extend the seat detail panel to report the occupying passenger's name, booking reference, status and special service requirement alongside the seat's own details
- [x] 2.4 Add the revision guard: compare the manifest's `cabinLayoutRevision` against the seat map's `revision` and suppress the drawing when they differ
- [x] 2.5 Render the redrawn-cabin notice in place of the drawing, stating that the cabin has changed since the flight was seated

## 3. The passenger table

- [x] 3.1 Build `app/features/flight/components/Manifest/ManifestTable.tsx` listing seat, deck, cabin class, name, booking reference, status and special service requirement
- [x] 3.2 Sort and compare names with a locale-aware collator so unicode names order correctly
- [x] 3.3 Render a no-show as a retained row whose status is distinguishable from boarded, never as a removed or empty row
- [x] 3.4 Render a passenger's special service requirement in their own row, in words, using the shared `Badge`
- [x] 3.5 Keep per-row work constant so a full widebody manifest does not degrade
- [x] 3.6 Make the table the primary reading: it renders as soon as the manifest resolves and stays when the drawing is absent or suppressed

## 4. Filters and summary

- [x] 4.1 Build `Manifest/ManifestFilters.tsx` with a status filter sent to the server and a cabin filter applied locally to the list only
- [x] 4.2 Add a filter for passengers travelling with a special service requirement, applied locally
- [x] 4.3 Build `Manifest/ManifestSummary.tsx` reporting the passenger count and the count per cabin class, naming the basis whenever a status filter is active so a filtered count is never read as a flight total
- [x] 4.4 Report the pinned cabin layout and revision in the summary
- [x] 4.5 Ensure no heading, tile, badge or summary figure counts or highlights passengers by special service requirement
- [x] 4.6 Render the no-matching-passengers state with a way to clear the filters

## 5. Operations surface

- [x] 5.1 Add a manifest route under `FlightLayout` in `app/routes.ts` and an entry in `FlightTabs`
- [x] 5.2 Compose the summary, filters, table and drawing, collapsing the drawing before the table at narrow widths
- [x] 5.3 Render the no-preliminary-loadsheet state stating that the manifest is generated from the preliminary loadsheet
- [x] 5.4 Render the no-cabin-layout state naming the cause and linking to the aircraft so the assignment can be made
- [x] 5.5 Render the forbidden state stating that the manifest is available only to the flight's captain

## 6. Pilot surface

- [x] 6.1 Add a cabin entry point to the pilot's tracking dashboard, shown only for a flight the pilot commands and only once a manifest can exist
- [x] 6.2 Render the manifest for the commanding pilot reusing the operations components unchanged
- [x] 6.3 Offer no entry point for a flight the pilot does not command, and handle a forbidden response defensively should one still be reached

## 7. Verification

- [x] 7.1 Run `npm run lint` and `npm run typecheck` clean, with no comments and no `biome-ignore` added
- [x] 7.2 Verify against the live API on LH880, whose manifest holds 178 passengers resolving to 178 unique deck-and-designator pairs against `lh-74h`'s 364 seats, leaving 186 free and nothing unmatched
- [x] 7.3 Verify the summary reports 3 first, 39 business, 15 premium economy and 121 economy unfiltered, and that these counts are relabelled when a status filter is applied
- [x] 7.4 Verify the two no-shows on LH880 keep their seats in both the table and the drawing, and that no boarded passenger occupies those seats
- [x] 7.5 Verify the 21 passengers carrying special service requirements appear in their rows in words, that the filter finds them, and that no summary figure counts them
- [x] 7.6 Verify all three absent states against real flights: a flight with no preliminary loadsheet, a flight whose aircraft has no cabin layout, and a pilot who does not command the flight
- [x] 7.7 Verify the revision guard by pointing the app at a seat map revision later than a manifest's pinned revision, and confirm the table survives while the drawing is withheld
- [x] 7.8 Verify a failed seat map request leaves the passenger list intact
- [x] 7.9 Verify unicode names sort correctly and are not mangled in the table or the seat detail
- [x] 7.10 Check contrast, focus order and non-colour encoding of seat occupancy and passenger status in light and dark against WCAG 2.1 AA
- [x] 7.11 Run `npm run build`
