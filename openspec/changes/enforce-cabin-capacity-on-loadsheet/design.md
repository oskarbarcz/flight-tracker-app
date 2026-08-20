## Context

Three changes add cabins to the app. This one deals with what they cost: a loadsheet that was previously free to state any passenger count is now bounded by the seats of a pinned layout, and the bound is enforced at two moments — release and the end of boarding — by a server the interface currently cannot interpret.

## Goals / Non-Goals

**Goals**

- Make the limit visible while the figure is still being typed.
- Make the refusal explicable when it happens anyway.
- Let operations state the per-cabin split without forcing them to.
- Keep flights without a cabin layout behaving exactly as before.

**Non-Goals**

- Enforcing capacity in the client. The API is the authority; the form informs.
- Editing a manifest to fit a loadsheet, or the reverse.
- Reconciling anything client-side. The API reconciles; the app reports the outcome.

## Decisions

### The form advises, the server decides

The capacity shown on the form comes from the seat map of the layout currently assigned, which can change between typing and releasing. Treating it as a hard client-side limit would let the form refuse a submission the server would have accepted, which is worse than the refusal it prevents.

So the passenger field carries a capacity hint, warns when the typed figure exceeds it, and still submits. The server's answer is the one that counts, and the warning exists to make that answer unsurprising.

### The refusal names both numbers

An unprocessable response on release means the loadsheet's passengers exceed the pinned revision's seats. Saying "Failed to release flight" wastes the one piece of information the reader needs. The message names the passenger count, the seat count, and which cabin layout imposed the limit, and points at the loadsheet as the thing to change.

The same applies at the end of boarding, against the final loadsheet, with the same shape of message and a different figure.

### Omitting the split is a decision, not a gap

The API distributes passengers proportionally across cabins when `passengersByCabin` is absent, and that is the right default — it is what generated every seeded manifest. So the field is opt-in: the form offers a per-cabin split, and leaving it alone omits the key entirely rather than sending an empty object or a set of zeroes, either of which would mean something different.

### The split is validated against the total, locally

The API requires the per-cabin figures to sum to the passenger total. That is arithmetic the form can check immediately, and a round trip to be told the numbers do not add up is a poor use of the reader's time. This is client-side validation of a stated contract, not client-side enforcement of a server judgement, and the distinction is why it is acceptable here and not for capacity.

### Reconciliation is reported, not inferred

When boarding finishes with a different final count, the API adds passengers into free seats or records the surplus as no-shows, and leaves everyone else untouched. The app reports what happened — how many were added, how many became no-shows — because a manifest that silently differs from the one released is indistinguishable from a manifest that was regenerated, and the whole point of reconciliation is that it is not.

### No layout means no change at all

Every capacity behaviour is conditional on a pinned layout. An aircraft without one gets no hint, no warning, no split field and no reconciliation report, and its loadsheet form is byte-for-byte what it is today. This is most of the fleet at the moment and must not regress.

## Risks / Trade-offs

- **The capacity figure costs a seat-map request** on a form that did not need one. Mitigated by fetching it only when a layout is assigned, and by treating its absence as simply no hint rather than an error.
- **A stale capacity** between form load and release. Accepted, and the reason the client does not enforce.
- **Per-cabin keys come from the layout, not from a fixed list.** The form must render the cabins the assigned layout actually has rather than assuming the four common classes.

## Migration Plan

No migration. Existing loadsheets without a per-cabin split continue to be distributed proportionally.

## Follow-up for the API

The unprocessable responses would be easier to render faithfully if they carried the two figures as fields rather than only in a message. The app can obtain both itself — the loadsheet has the count and the seat map has the capacity — so this is a robustness improvement, not a blocker.
