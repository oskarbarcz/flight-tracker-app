## Why

A flight's cargo is one number today: tonnage on the loadsheet. The API now generates, at release, a manifest that accounts for that tonnage shipment by shipment — air waybills with shippers and consignees, IATA special handling codes, dangerous goods with UN numbers and emergency response codes, cold chain assessments with endurance against exposure — and places every unit in a hold position of the variant the load was planned against.

A cargo flight cannot see any of it. `useFlightCabin` returns `gap: "cargo"` for a cargo service, so the Cabin & manifest tab of a freighter is empty: an entire flight type has no load visibility at all. A passenger flight is barely better off, since the same endpoint is the only account of what rides in its belly.

The hold drawing already exists by the time this change starts. Its spec separates placement from appearance for exactly this reason, so what remains is to supply a load: readings of a filled hold, a ledger of the waybills, and the derived views that turn a list of weights into an account of what is aboard and whether it is safe and on time.

## What Changes

- Add a **`cargo-manifest` feature slice** with the manifest types, its service, its labels for special handling codes and commodities, and the derivations built on it.
- Add a **`useFlightCargo` hook** mirroring `useFlightCabin`, resolving the flight to a manifest or to a named gap — not released, no curated hold data, no cargo, forbidden, failed.
- Give the hold diagram **five readings of a load** — content class, weight saturation, volume saturation, hazard, and cold chain — each supplied to the placement layer built in `curate-aircraft-cargo-holds` without touching it.
- Mark a loaded position by **what the unit carries**: dangerous goods, cargo aircraft only, refrigerated device, priority, sealed and beyond-destination, each by marker and text rather than by colour alone.
- Add the **manifest figures**: cargo weight, units, shipments, dangerous goods, cargo-aircraft-only, transfers, tightest connection, baggage and bags with the source of the baggage figure, and the worst cold chain risk aboard.
- Add a **reconciliation strip** showing that the units' gross and tare weights sum to the cargo weight the manifest accounts for, and that the compartment loads sum to the same — the cargo counterpart of the fuel build-up.
- Add the **shipment ledger**: every waybill, filterable by handling code, hazard class, transfer role, status and cold chain risk, each expanding to a waybill card carrying shipper, consignee, route, onward carrier and connection.
- Add a **compartment load table** reporting each compartment's weight and volume against its limits and the dry ice it carries.
- Add a **cold chain timeline** drawing each temperature-controlled shipment's endurance against its exposure, with the resulting margin and risk, presented as advisory.
- Add **load advisories** derived only from fields the API supplies: dry ice in an unventilated compartment, live animals in a compartment that is not heated and ventilated, a cargo-aircraft-only shipment on a passenger flight, a unit over its position's weight limit, and a compartment over its weight or volume limit.
- Add the **offload story**: what was left behind, why, and the position it came out of.
- Add the **unload sequence**, derived from priority, transfer role, connection time, sealed and beyond-destination, stating what it is derived from.
- Surface the manifest for **operations on the flight file, for the pilot on the tracking dashboard, and for cabin crew on a flight they captain**.

The notification to captain is out of scope and follows as a separate change.

## Capabilities

### New Capabilities

- `flight-cargo-manifest`: how a flight's load is read — the figures it reports, how they reconcile, the shipment ledger and the waybill, the compartment loads, the offload story, and the states in which no manifest can be shown.
- `cargo-load-readings`: how a loaded hold is drawn — the five readings of a position, what a loaded, empty and offloaded position looks like, and what a unit's markers convey.
- `cargo-load-advisories`: the derived views — the load advisories and what they are permitted to assert, the cold chain timeline, and the unload sequence — each labelled as derived and none of them gating anything.

### Modified Capabilities

<!-- None. `cargo-hold-diagram` already provides for a second reading of the same hold without changing placement; this change supplies one rather than altering that contract. -->

## Impact

- **Frontend code**: a new `app/features/cargo-manifest/` slice — `model.ts`, `service.ts`, `i18n.ts`, `hooks/useFlightCargo.ts`, `lib/reconciliation.ts`, `lib/advisories.ts`, `lib/unloadSequence.ts`, `lib/coldChain.ts`, and components for the figures, the ledger, the waybill card, the compartment table, the timeline, the advisories and the offload story. The hold diagram is consumed from `app/features/cargo-hold/`, not modified.
- **Routes**: a cargo route on the operations flight file, a new tab on `FlightTrackingDashboard`, and the cabin crew surface. `HistoryDataTabs` is deliberately untouched: the passenger manifest is already current-flight-only and cargo follows it.
- **API**: consumes `GET /api/v1/flight/{id}/cargo-manifest` with and without `status`. Deployed; no API work.
- **Depends on `curate-aircraft-cargo-holds`** for the hold catalogue service, the designator normalisation and the placement layer. It does not depend on any change to them.
- **Reconciliation holds exactly, verified live**: on `AA4912` the units' gross and tare sum to 8 500 kg against a reported 8 500, and the two compartment loads sum to the same; on `CV2020` gross 13 672 plus tare 1 228 is 14 900 against a reported 14 900, with three compartment loads summing to 14 900. The strip is a real check, not a decoration.
- **The advisories have live cases, verified**: `CV2020` carries 900 kg of dry ice in `b74f-nose` lower compartment 1, which reports `heated: false` and `ventilated: false` — dry ice is an asphyxiant and is reported per compartment for that reason. The same flight's live horses sit at `6AL` in main compartment 6, which is both heated and ventilated, so the animal check passes on the same manifest that the dry ice check flags.
- **A passenger flight carries a cargo-aircraft-only shipment**: `AA4912` is a passenger service reporting `cargoAircraftOnlyCount: 1` — UN3480 lithium ion cells at position `11R` with `cargoAircraftOnly: true` — although the schema states that count is "always zero on a flight carrying passengers". The advisory catches a contradiction the API asserts cannot occur.
- **Positionless loads are ordinary**: `AA2019` and `AA2021` report `holdVariant: null` and carry a single `bulk_lot` unit with null deck, compartment and position. Two of the six seeded manifests have no geometry at all, so the positionless reading is a main path.
- **The status filter is partial**: under `?status=offloaded` the units array still returns every unit, each with its shipments filtered away, while `cargoKg` and `containerCount` continue to report the whole load. Only `shipmentCount` and `dangerousGoodsCount` respect the filter. Empty units are pruned client-side and unfiltered totals are not shown beside filtered ones.
- **`containerCount` is not the notification's `containerCount`**: the manifest reports 7 for `CV2020` while the notification splits the same load into 4 containers and 3 pallets. The two are never presented as the same figure.
- **An undocumented field is in use**: `dangerousGoods.sourceNote` appears on `CV2020`'s UN1845 entry explaining the drill letter chosen, and is absent from the schema. Modelled as optional.
- **Large parts of the contract have no seeded data**: no shipment anywhere is offloaded, `contentClass` is only ever `cargo` so baggage, mail, `bagCount`, `baggageSource` and `priority` are unexercised, `transferRole` is always `local` so `transferCount` and `tightestConnectionMinutes` are always zero and null, and only `AKE` and `AMA` of the seven device types appear — no refrigerated device, although `CV2020` carries an active cold chain shipment in a plain `AKE`. Those paths are built to the contract and flagged in the spec as unverified against data.
- **Versioning**: `package.json` must be bumped before merge.
- **Accessibility**: WCAG 2.1 AA in both themes; every marker carries a text cue, and the ledger is the accessible peer of the loaded drawing.
