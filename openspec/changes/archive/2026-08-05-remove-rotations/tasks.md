## 1. Remove rotation routes

- [x] 1.1 Delete route entries in `app/routes.ts`: `operators/:operatorId/rotations` (list), `operators/:operatorId/rotations/new` (create), and `operators/:operatorId/rotations/:rotationId/edit` (edit)
- [x] 1.2 Delete route component directory `app/routes/operations/operators/rotations/` (`CreateRotationRoute.tsx`, `EditRotationRoute.tsx`, `OperatorRotationsRoute.tsx`)
- [x] 1.3 Verify `OperatorLayout` in `app/routes.ts` still has at least the `fleet` child and no dangling rotation reference

## 2. Remove rotation feature module

- [x] 2.1 Delete `app/features/rotation/` in full (`index.ts`, `model.ts`, `schema.ts`, `service.ts`)
- [x] 2.2 Remove `RotationService` from `app/shared/api/useApi.tsx`: the import, the `rotationService` field on `ApiServices`, and the `rotationService: new RotationService()` instance in `ApiProvider`

## 3. Remove rotation-only operator and pilot components

- [x] 3.1 Delete operator rotation components: `RotationFlightsInputBlock.tsx`, `RemoveRotationModal.tsx`, `PickFlightModal.tsx`, `RotationListEmptyState.tsx`, `RotationControls.tsx`, `RotationListTable.tsx`
- [x] 3.2 Delete pilot dashboard `CurrentRotationBox.tsx` (`app/features/flight/components/Dashboard/Main/Box/`)
- [x] 3.3 Delete transitively rotation-only helpers now unused: `app/features/operator/components/Form/Preview/LegPreview.tsx`, `app/features/operator/components/Form/PilotLicenseInputBlock.tsx`, `app/features/operator/components/Form/Preview/PilotInputPreview.tsx`

## 4. Remove rotation from the flight domain

- [x] 4.1 In `app/features/flight/model.ts`, remove the `rotationId` field, its constructor assignment, and the `FlightWasAddedToRotation` / `FlightWasRemovedFromRotation` members of `FlightEventType`
- [x] 4.2 In `app/features/flight/i18n.ts`, remove the two rotation event labels (in lockstep with 4.1 so the exhaustive `Record<FlightEventType, string>` stays complete)
- [x] 4.3 In `app/features/flight/request.ts`, remove `rotationId` from `ApiFlightResponse` and from the `Omit<...>` key list in `CreateFlightRequest`

## 5. Remove rotation from the operator domain and navigation

- [x] 5.1 In `app/features/operator/request.ts`, remove the `import type { Rotation }` and the `CreateRotationRequest`, `EditRotationRequest`, `GetRotationResponse` types
- [x] 5.2 In `app/features/operator/components/Table/Tabs/OperatorTabs.tsx`, remove the `Rotations` tab entry (leaving `Fleet`)
- [x] 5.3 In `app/features/operator/components/List/OperatorCard.tsx`, repoint the card target from `/operators/${operator.id}/rotations` to `/operators/${operator.id}/fleet`
- [x] 5.4 In `app/routes/pilot/PilotDashboardRoute.tsx`, remove the `CurrentRotationBox` import and its usage in the JSX

## 6. Scrub docs and marketing copy

- [x] 6.1 Remove "rotation" from the `useApi()` bullet in `CLAUDE.md` and the dispatcher line in `PRODUCT.md`
- [x] 6.2 Update the "Current rotation" example in `docs/DESIGN_SYSTEM.md` to a non-rotation example
- [x] 6.3 Reword landing copy dropping the rotation phrase in `HowItWorksSection.tsx`, `LandingHero.tsx`, and `OperatorDeepDiveSection.tsx` (keep each sentence grammatical)

## 7. Verify

- [x] 7.1 Run `npm run typecheck` and resolve any errors (expected clean after ordered edits)
- [x] 7.2 Run `npm run lint` (and `lint:fix` if needed)
- [x] 7.3 Run `npm run build` to regenerate `.react-router/types` and `build/` artifacts
- [x] 7.4 Run a repo-wide case-insensitive `rotation` search excluding `RunwayLines.tsx` (false positive), `.react-router/`, and `build/`; confirm only intended remnants remain
- [x] 7.5 Manually verify the operator area lands on Fleet and the pilot dashboard renders without the rotation box
