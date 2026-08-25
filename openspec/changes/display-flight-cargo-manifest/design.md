## Context

See proposal.md — Why.

`curate-aircraft-cargo-holds` has landed by the time this starts, so the hold catalogue service, designator normalisation and the placement layer exist, and the diagram spec already provides for a second reading of the same hold without changing placement. What remains is a load to supply.

Three properties of the manifest shape the approach. It is generated at release and immutable thereafter, so nothing here is a form and nothing is optimistic. It reconciles exactly — verified on two live flights — so the reconciliation is a real check rather than a flourish. And it is nested unit-first while almost every view a reader wants is shipment-first, so one join is unavoidable.

The gap state is not the exception. Of six seeded manifests, two report `holdVariant: null` and carry a single loose lot with null deck, compartment and position. A positionless load is a main path, not a fallback.

## Goals / Non-Goals

**Goals:**

- Supply a load to the existing placement layer without modifying it.
- Make the reconciliation visible, in the manner of the fuel build-up, because it is the strongest claim this feature makes.
- Derive the advisories, the timeline and the sequence openly, so a reader can check them.
- Degrade to something useful, not to an error, when there is no geometry.

**Non-Goals:**

- Loading, moving or offloading anything. The API exposes no such operation.
- Any cross-flight view. Cargo is read for the current flight only; the transfer fields are texture on a waybill, never navigation.
- The notification to captain, which is a separate change against the same data.
- Encoding regulatory segregation rules the API does not supply.

## Decisions

### The shipment index is built once, beside the unit tree

The manifest nests shipments inside units, which is right for the drawing and wrong for the ledger, the filters, the advisories and the timeline. Rather than walking the tree in each of them, one pass builds a flat shipment index carrying, for every shipment, a back-reference to the unit and through it to the position, compartment and deck.

*Alternative considered — deriving in each view.* Rejected: four independent traversals of the same tree, four chances for them to disagree about what a shipment's compartment is, and a filter that cannot be applied without one of them.

The index is the join. Everything shipment-first reads it; the drawing reads the unit tree.

### Reconciliation is computed, not trusted

The strip recomputes the sums rather than restating `cargoKg`. It presents the units' contents, their tare, the total, and the compartment loads against the same total. Where they disagree the discrepancy is reported.

This costs almost nothing and it is the difference between a claim and a check. It is also the one place a future API change would show up immediately rather than silently — and given that roughly fifteen fields in these schemas are mistyped, a silent divergence is a live possibility. Verified reconciling on `AA4912` at 8 500 kg and `CV2020` at 14 900 kg.

### Advisories are a rule list, each naming its own inputs

Each check is an independent function over the manifest and the hold configuration, returning either nothing or a finding that carries the values it was derived from. The panel renders findings; it holds no rule knowledge.

The six checks are exactly what the data supports: dry ice against compartment ventilation, live animals against compartment heating and ventilation, cargo-aircraft-only against the flight's service, unit weight against position limit, compartment weight against limit, compartment volume against limit.

*Alternative considered — a hard-coded IATA segregation table* (class 3 against class 5.1, radioactive separation distances, the full incompatibility matrix). Rejected on ownership: aviation safety rules encoded in a frontend will drift from the standard with nobody watching, and the product would be asserting compliance it cannot substantiate. If the API ever supplies a matrix it becomes another rule in the list, and the panel does not change.

A check that cannot run reports as not applicable, never as passing. Where there is no hold variant, the compartment checks cannot run, and saying "no issues" there would be a lie.

The clean-load state names the checks performed. Silence that does not say what was checked is indistinguishable from not checking.

### The unload sequence is a sort with a stated key

Priority baggage, then local cargo, then transfers ascending by time to connect, with sealed beyond-units removed from the order and reported as remaining aboard, grouped by compartment and door. The header states the fields the sort used.

This is the most derived thing in the change and the proposal says so. What keeps it honest is that every input is a field the manifest reports and the ordering rule is stated where the reader can see it — the same contract the fuel build-up honours by showing its subtotals.

### The cold chain timeline is two bars and a difference

Endurance and exposure drawn on one axis, margin as the gap. Every figure comes from the API's `coldChain` block, including its own `explanation`, which is rendered rather than paraphrased. `advisory` is always true and the presentation says so.

There is no seeded shipment in a refrigerated device despite `CV2020` carrying an active-solution shipment in a plain `AKE`, so the reefer path is contract-derived.

### The status filter is applied again on the client

Under `?status=offloaded` the API filters shipments out of the units but returns every unit, and leaves `cargoKg` and `containerCount` reporting the whole load. Only `shipmentCount` and `dangerousGoodsCount` respect the filter.

The client therefore prunes units carrying no matching shipment, and the offload view shows only figures that respect the filter. Mixing a filtered shipment count with an unfiltered cargo weight on one panel would produce a screen where the numbers cannot both be true.

### `containerCount` is never rendered as a shared figure

The manifest counts 7 devices for `CV2020`; the notification splits the same load into 4 containers and 3 pallets. Both are correct under their own definitions. The manifest surface says "units" and the notification surface keeps the document's own split, so the two never appear as the same quantity with different values.

### Gap resolution mirrors `useFlightCabin`

A discriminated state — loading, unavailable with a named gap, ready — resolved from the flight before any request where possible and from the response status where not. The gaps are not-released, no-hold-data, no-cargo, forbidden and failed. This is settled behaviour in the passenger manifest and there is no reason for cargo to differ.

`no-hold-data` is distinct from the others: it is a *ready* state with a reduced view, not an unavailable one. The load is shown; only the drawing is withheld.

## Risks / Trade-offs

- **Large parts of the contract have no seeded data** — nothing offloaded, no baggage or mail unit, no transfer, five of seven device types absent. → Built to the contract, flagged in the spec as unverified against data, and the verification tasks say plainly which paths were exercised and which were not.
- **The unload sequence is derived and a reader may take it for an instruction.** → It states that it is derived and names its inputs; it is presented as an order, not a procedure, and nothing depends on it.
- **The advisories may read as a compliance verdict.** → Each names its inputs, the clean state names the checks performed, checks that cannot run say so, and nothing is gated. The panel never says the load is compliant, only what these checks found.
- **A passenger flight carrying a cargo-aircraft-only shipment contradicts the API's own documentation.** → The advisory reports it rather than suppressing it. If the data is wrong, showing it is how that gets noticed.
- **The shipment index duplicates the unit tree in memory.** → Manifests are small — the largest seeded load is 7 units and 7 shipments — and the index holds references, not copies.
- **Schema types are lossy and one field is undocumented.** → Models hand-written against captured payloads, `sourceNote` modelled as optional, and the reconciliation check surfaces any divergence rather than hiding it.

## Migration Plan

Additive. A new slice, a new route on the operations flight file, a new tab on the tracking dashboard, and the cabin crew surface. The only existing behaviour that changes is that a cargo-service flight stops being told its manifest is unavailable, which is the point. Nothing writes, so there is no state a rollback would strand.

`package.json` must be bumped before merge.

## Open Questions

- Whether the offload story is better as its own panel or as a state of the ledger. It changes no requirement and no task and can be settled against the first real offloaded shipment, of which there are currently none.
