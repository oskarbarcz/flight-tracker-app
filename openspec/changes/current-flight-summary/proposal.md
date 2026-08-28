# Current flight summary

## Why

The current flight card is the first thing a pilot sees on the dashboard, and it is the thinnest
panel on it. `Flight` carries roughly fifty fields; the card renders four of them — flight number,
registration, the two airport codes — plus a status word and a countdown.

The waste is worst exactly where there is most room. The card is `lg:col-span-2`, about 727px on a
desktop, and its widest element is a 4px progress rail stretched across some 450px of empty card
carrying a single implicit number. Meanwhile the timesheet holds twelve timestamps and the card
shows one, the airports array holds alternates and ETOPS entry/exit points and the card shows two
airports, and both loadsheets are ignored entirely.

The card should not become a second details page — `/track/:id` is that, and it is one tap away.
It should use the width it already occupies to answer the three questions a pilot actually asks
before a flight: *am I on time*, *where in the flight am I*, and *are the numbers final yet*.

## What Changes

- The progress rail stops being decoration and becomes the card's primary instrument on desktop: a
  time axis with the four block events pinned to it in their real proportions, scheduled marks
  against estimated or actual ones.
- The card gains a deliberate responsive contract. On a phone it stays exactly what it is now — a
  four-fact summary. From `lg` up it fills its two columns instead of padding them with whitespace.
- The loadsheet figures return, desktop only, as one row rather than the four-tile grid that was
  removed — and they carry the preliminary/final marker, which is the part that tells a pilot
  whether to trust them.
- Destination and enroute alternates become visible, with the aircraft's ETOPS threshold where one
  applies. They are currently unreachable from the dashboard despite the sidebar naming them.
- Delay is stated as a signed figure against the scheduled time on both ends, not only as a single
  `+15` chip beside the departure estimate.

## Non-goals

- The seventeen-figure fuel breakdown, the passenger manifest, and runway analysis stay on
  `/track/:id`. This change adds no route and no new API call.
- No new phase rail duplicating the tracking page's PREP / TAXI OUT / CRUISE / TAXI IN / TURN strip.
- Parking position and runway stay out: `Flight` carries only their IDs, so showing a stand or a
  runway would need resolution this change does not take on.
- The mobile card's content does not grow. Every addition below is `hidden lg:*`.
