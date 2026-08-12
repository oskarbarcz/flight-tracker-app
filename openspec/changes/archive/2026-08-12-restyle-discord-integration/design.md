## Context

See proposal.md — Why. The relevant constraints come from `DESIGN.md`:

- **The Rare Accent Rule**: Instrument Indigo (`#6366f1`) appears on ≤10% of a screen, on actions and the one current selection. "If two things on a panel are indigo, one of them is wrong."
- **The Flat Surface Rule**: surfaces are flat, separated by a 1px border and a one-step tonal change, never a shadow.
- The system's anti-references explicitly reject decoration that does not convey state.

Register is `product`, platform `web`, and the surface is **Operate** — the visitor is completing a task, so scanability and consistency with neighbouring flows outrank expression. That is why this is a refinement against the incumbent world rather than a new visual direction.

## Goals / Non-Goals

**Goals:**

- Make the Discord section read as part of the account record rather than as a bespoke component dropped into it.
- Let a third-party integration be recognisable as itself without introducing a competing accent.
- Keep every behaviour, state, and string already specified.

**Non-Goals:**

- No change to the connect, disconnect, join, or membership behaviour.
- No new visual world; `DESIGN.md`'s north star is unchanged apart from one scoped exception.
- No restyle of the Google section beyond the account record's measure.

## Decisions

### Reuse the page's own vocabulary before inventing any

Every visual value in the card now comes from something already on this page: the full-width slot from the email section's pending-change panel, the monospaced identifier treatment from the email value, the `green-700`/`amber-700` status markers and the divider-above-consequence shape from the email-change progress panel, and the inner-panel radius, padding, and dark fill from the same component. The card had drifted from all four.

*Alternative considered:* tuning the bespoke values until they looked right. Rejected — it would have produced a second, parallel vocabulary for the same concepts, which is the actual defect.

### Brand hue is admitted, and scoped to identifying marks

Discord's brand hue now appears on the avatar ring and the Discord glyphs. `DESIGN.md` gains "The Integration Brand Exception" so this is a system rule rather than a local exemption: an integration's hue is permitted on marks that identify it, never on actions, text, or surfaces.

This was chosen against the initial recommendation. The recommendation was wrong in an instructive way: Discord's blurple (`#5865f2`) sits within a few percent of Instrument Indigo (`#6366f1`), so it reads as tonal rather than as a second accent, and the Rare Accent Rule is barely strained. The corollary is that the hue is not what makes the integration recognisable — the logo shape is. Anyone wanting the colour itself to differentiate would need a more distant blurple, which would be a real second accent and a different decision.

### Two brand tokens, because one fails contrast

`#5865f2` measures 4.60:1 on white — above the 4.5:1 bar — but 3.82:1 on the `#111827` dark canvas, below it. `--color-discord-light` (`#949cf7`, 7.14:1 on the dark canvas) covers dark mode. Both are tokens in `@theme` rather than inline hexes so the brand hue has one definition and cannot drift from the app's own indigo by accident.

### Match the foreign control rather than the local token

The Discord sign-in button sits directly beneath Google's iframe-rendered branded button, which cannot be restyled. Its border is `#dadce0` and its label is weight 500. The button therefore takes `gray-300` (`#d1d5db`) and `font-medium` rather than the `gray-200` hairline token and the theme's `font-semibold`, because for two adjacent controls that must read as peers, optical parity with the neighbour outranks fidelity to a token used for panel dividers. Both values remain system tokens.

## Risks / Trade-offs

- **A second accent hue exists in the system now.** → Confined by a named rule to identifying marks, and in practice near-identical to the existing accent, so it cannot visually compete. The rule is what prevents the next use from spreading it to a button.
- **Two local overrides on the sign-in button diverge from the theme.** → Documented above with the measured values they match. If Google ever changes its button, these are the two values to re-measure.
- **The narrower record makes the Google row's explanation wrap to three lines.** → Accepted; it is secondary copy, and the row still reads cleanly. Legibility of a short note was traded for a measure appropriate to label-value-action rows.
- **The brand hue is not what identifies Discord.** → Stated plainly rather than papered over; the glyph carries recognition. Noted so nobody later concludes the token is doing more work than it is.
