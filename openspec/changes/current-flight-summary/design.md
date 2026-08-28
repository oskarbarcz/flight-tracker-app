# Design

## Context

See `proposal.md` — Why. No API work is involved: every field below already arrives with the
flight the dashboard fetches. The whole question is which of them earn a place on a dashboard card,
and how the desktop width gets used.

What the card has to work with, and what it currently spends:

| Source | Fields available | Rendered today |
| --- | --- | --- |
| `timesheet` | `scheduled` / `estimated` / `actual`, each with `offBlockTime`, `takeoffTime`, `arrivalTime`, `onBlockTime` — twelve timestamps | one derived value |
| `airports[]` | typed: departure, destination, destination alternate, enroute alternate, ETOPS entry, ETOPS exit | two |
| `loadsheets` | `preliminary` and `final`, each with passengers, `passengersByCabin`, cargo, payload, zero-fuel weight, block fuel, `flightCrew` | none |
| `aircraft` | airframe, registration, selcal, livery, `currentState`, `baseAirport`, `etopsThresholdMinutes`, `cabinLayout` | registration |
| `status` | twelve-state enum | one badge |
| flags | `hasActiveEmergency`, `isFlightDiverted`, `hasFlightPath`, `tracking`, `source`, `actualFuelBurned`, `pilot`, `callsign` | none |

Four facts drive every decision below:

1. **The card is two columns wide on desktop and one on mobile.** `PilotDashboardRoute` puts it in a
   `lg:col-span-2` wrapper — roughly 727px against 375px on a phone. One component, two very
   different amounts of room.
2. **Height is the scarce resource on mobile; width is the wasted one on desktop.** The phone card
   already pushes its Manage button toward the fold. The desktop card has ~450px of empty rail.
   Anything added must be bought with width, not height.
3. **`estimated` does not exist until check-in.** `FlightInfoBox` gates on
   `status !== Created && status !== Ready`. Any scheduled-versus-estimated presentation must
   collapse to scheduled-only for a `Ready` flight rather than render empty columns.
4. **`actual` is partial by design.** Its four fields are independently nullable, filling in as the
   flight progresses. A presentation that assumes all four exist will break mid-flight.

## Ideas considered

### Idea A — Time axis (selected)

Feed the existing progress rail the timestamps it is already positioned by. On desktop the rail
becomes a real axis: the four block events pinned along it at their true proportions — off-block,
takeoff, arrival, on-block — each carrying its time, and the scheduled mark shown against the
estimated or actual one where they differ.

The appeal is that it spends width rather than height, which is the only currency available. It also
turns the emptiest element in the card into the densest without adding a single row, and it is the
one composition that reads as an instrument rather than as a table — which matters for a panel whose
job is a glance. Taxi time and block time become legible as *distances* instead of as figures a
reader has to subtract.

Cost: a horizontal axis needs width to stay honest, so below `lg` it must degrade to the plain
two-endpoint rail the card has now. That is acceptable — mobile is explicitly staying as it is.

### Idea B — Time ladder

A four-row table in a right-hand column: OFF / OUT / IN / ON down the side, scheduled and estimated
as columns, a signed delta at the end, block time as a footer row.

More precise than Idea A and much easier to build — the figures are exact and alignable, and
`calculateBlockTime` in `FlightInfoBox` already computes the derived row. But it is a second table
bolted beside a summary, it reads as paperwork rather than as a dashboard instrument, and it costs
four rows of height that the mobile layout would then have to hide. Kept as the fallback if the axis
proves too cramped at 1024px, where the card is at its narrowest above `lg`.

### Idea C — Load and fuel strip

One desktop-only row of figures — passengers, cargo, crew, block fuel, zero-fuel weight — carrying
the preliminary/final marker.

This is not an alternative so much as a component of the answer: it is cheap, it is one row, and the
marker restores the only piece of information whose loss actually mattered when the four-tile grid
was removed. Adopted alongside Idea A rather than instead of it.

### Idea D — Full briefing panel

Everything above plus alternates, ETOPS, parking stand, runway, source, tracking visibility and
crew names — the card as a miniature `/track/:id`.

Rejected. It defeats the card's purpose, it needs resolution work for the stand and runway IDs, and
the details page already does it better with room to spare.

## Decision

**Idea A for the desktop composition, Idea C as its second band, Idea B held in reserve.**

The card resolves into four bands, of which only the first, third and last exist on mobile:

| Band | Mobile | Desktop |
| --- | --- | --- |
| Identity | fin, flight number, registration, status, estimated departure | unchanged |
| Time axis | plain two-endpoint rail | four events pinned to a proportional axis with scheduled-versus-actual marks |
| Route | codes, airport names, city and country | plus alternates and ETOPS threshold |
| Figures | absent | passengers, cargo, crew, block fuel, with the preliminary/final marker |
| Action | countdown, Manage | unchanged |

Two rules keep this from drifting back into a details page. Every desktop addition is bought with
width, never height — if a band cannot be expressed horizontally it belongs on `/track/:id`. And the
card states figures it already holds; it computes nothing that needs another call.

## Presentation notes

The axis is a measuring instrument, so it follows DESIGN.md's data conventions rather than inventing
new ones: times in Roboto Mono with `tabular-nums`, deltas signed and unit-suffixed, the axis itself
a hairline with tonal marks rather than a coloured bar. Indigo stays scarce — it marks the aircraft's
present position on the axis and nothing else, which is the one thing on the card that is genuinely
"here, now".

Delay uses the semantic quartet with a word or sign beside the hue, never hue alone. An early
arrival is not a warning; a negative delta is stated as such and left neutral.

## Risks

- **1024px is the tight case.** At exactly `lg` the card is at its narrowest above the breakpoint,
  and four pinned labels on one axis may collide. Mitigation: pin two labels above the axis and two
  below, and fall back to Idea B if they still collide.
- **Mid-flight partial `actual`.** Each of the four marks resolves independently: actual where
  present, else estimated, else scheduled, and it states which it used.
- **A `Ready` flight has no estimates.** The axis then shows scheduled marks only and no deltas,
  rather than four zeroes.
