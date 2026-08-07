## Context

Flight rotation is spread across four surfaces in the SPA: a self-contained feature module (`app/features/rotation/`), a set of operator routes and operator/pilot UI components, references baked into the flight domain (`Flight.rotationId`, two `FlightEventType` members and their i18n labels, the create/response request shapes), and navigation entry points (operator tabs + operator card, whose default target is the rotations route). It is also referenced in docs and landing marketing copy.

The backend is a separate repository. This change is frontend-only: it stops calling rotation endpoints and stops reading/sending `rotationId`, but does not alter any backend contract or persistence. No tests reference rotation. The work happens on the existing `feature/remove-rotations` branch.

The removal must keep the build green at every checkpoint. Two couplings force ordering:
1. `FlightEventType` members (`model.ts`) and their labels in `i18n.ts` are joined by a typed exhaustive `Record<FlightEventType, string>` — removing one without the other breaks typecheck.
2. Deleting the rotation routes leaves `OperatorLayout` and the operator landing navigation pointing at nothing, so navigation must be repointed in the same pass.

## Goals / Non-Goals

**Goals:**
- Delete every file that exists solely for rotation, plus helpers that become dead code once those are gone.
- Remove every cross-reference from non-rotation code (flight model/request/i18n, operator request types, `useApi`, navigation, pilot dashboard).
- Keep `npm run lint`, `npm run typecheck`, and `npm run build` passing after the change.
- Repoint operator navigation to a sensible surviving destination (the fleet view).
- Scrub rotation mentions from docs and landing copy so the repo has no dangling references.

**Non-Goals:**
- Designing or stubbing the future rotation re-implementation. Nothing is left behind as a placeholder.
- Any backend/API contract change (separate repo).
- Data migration — there is no client-side persisted rotation state to migrate.
- Touching the unrelated geometric `rotation`/`labelRotation` code in `RunwayLines.tsx` (runway-label CSS rotation, a false positive).

## Decisions

**Delete the whole `app/features/rotation/` module rather than emptying files.** The module (index/model/schema/service) has no non-rotation consumers, so full deletion is cleanest and leaves no dead barrel exports. Alternative (keep the module, gut internals) was rejected — it leaves import noise and an empty capability that the re-design would have to reconcile with.

**Delete transitively rotation-only helpers, don't keep them "just in case."** `LegPreview.tsx`, `PilotLicenseInputBlock.tsx`, and `PilotInputPreview.tsx` have no importers once the rotation routes/components are gone. Keeping them would be dead code, which the project style forbids. They are verified to be imported only from rotation code before deletion.

**Repoint operator navigation to the fleet view.** `OperatorCard` currently defaults to the rotations route and `OperatorTabs` lists Rotations first. With rotations gone, `fleet` is the natural landing surface, so the card target becomes `/operators/:operatorId/fleet` and the Rotations tab is dropped, leaving Fleet as the sole/landing tab. Alternative (point to a bare operator page) was rejected — no such page exists and Fleet is the meaningful destination.

**Remove `rotationId` from the flight model and request shapes outright.** Since nothing reads it after `PickFlightModal` and `CurrentRotationBox` are deleted, leaving it would be an unused field carrying retired semantics. The re-design will define its own flight↔rotation linkage.

**Order the edits to keep the build green.** Sequence: (1) delete leaf routes + register removal in `routes.ts`; (2) delete rotation feature module and rotation-only components/helpers; (3) remove `RotationService` from `useApi`; (4) remove flight `FlightEventType` members and their i18n labels together; (5) remove `rotationId` from model/request; (6) remove operator rotation request types; (7) repoint navigation; (8) scrub docs/copy. Run typecheck/lint/build at the end (and optionally after the flight-domain edits, the most coupling-sensitive step).

## Risks / Trade-offs

- **Exhaustive `Record<FlightEventType, string>` breaks if enum and i18n drift** → Remove the two enum members and their two i18n labels in the same edit pass, then typecheck immediately.
- **A hidden consumer of a "rotation-only" helper turns it into a broken import** → The inventory verified `LegPreview`/`PilotLicenseInputBlock`/`PilotInputPreview` are imported only by rotation code; `typecheck`/`build` will catch any missed importer. Delete these last and let the compiler confirm.
- **Dangling navigation after route deletion** → Repoint `OperatorCard` and `OperatorTabs` in the same change; manually verify the operator area still lands on Fleet.
- **Stale generated/build artifacts still contain "rotation"** (`.react-router/types/...`, `build/client/assets/*`) → These regenerate on `npm run typecheck`/`npm run build`; do not hand-edit. A final `npm run build` refreshes them.
- **Missed reference elsewhere** → After edits, a repo-wide case-insensitive `rotation` grep (excluding the `RunwayLines` false positive, generated `.react-router/`, and `build/`) should return only intended remnants; resolve any surprises before finishing.

## Migration Plan

Frontend-only, no runtime data migration. Deploy is the normal PR → merge → GitHub Pages release flow. Rollback is a straight `git revert` of the change branch, since nothing external is mutated. `package.json` version must be bumped before merge (enforced by CI). Per project workflow, the tracker issue on project board #12 is created only after the user approves this proposal, not automatically.

## Open Questions

- Should the landing marketing copy that mentions "rotations" be reworded to describe the current product, or simply have the rotation phrase dropped? Default: drop the rotation phrase while keeping each sentence grammatical, since the re-design's shape isn't defined yet.
- Confirm `fleet` is the desired operator landing destination once Rotations is removed (assumed yes; it is the only remaining operator child route).
