---
name: MyPreflight
description: Operations and cockpit tooling for a virtual airline — precise, dependable, document-grade.
colors:
  signal-indigo: "#5850ec"
  signal-indigo-deep: "#5145cd"
  signal-indigo-mark: "#6875f5"
  signal-indigo-light: "#8da2fb"
  signal-indigo-wash: "#e5edff"
  signal-indigo-tint: "#f0f5ff"
  ink-strong: "#111827"
  ink: "#374151"
  muted: "#6b7280"
  hairline: "#e5e7eb"
  paper: "#ffffff"
  paper-band: "#f9fafb"
  canvas: "#f3f4f6"
  night-canvas: "#030712"
  night-paper: "#111827"
  night-band: "#1f2937"
  night-muted: "#9ca3af"
  success: "#046c4e"
  success-wash: "#def7ec"
  warning: "#bb4d00"
  warning-wash: "#fef3c6"
  info: "#0069a8"
  info-wash: "#dff2fe"
  danger: "#c81e1e"
  danger-wash: "#fde8e8"
  danger-stroke: "#e02424"
  discord: "#5865f2"
  discord-light: "#949cf7"
typography:
  display:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
  title:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.5
  body:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  caption:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
  label:
    fontFamily: "Noto Sans, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.08em"
  data:
    fontFamily: "Roboto Mono, monospace"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.5
    fontFeature: "\"tnum\""
  data-display:
    fontFamily: "Roboto Mono, monospace"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "\"tnum\""
rounded:
  sm: "4px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.signal-indigo}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.signal-indigo-deep}"
    textColor: "{colors.paper}"
  button-alternative:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "40px"
  button-alternative-hover:
    backgroundColor: "{colors.signal-indigo-tint}"
    textColor: "{colors.signal-indigo-deep}"
  button-subtle:
    backgroundColor: "transparent"
    textColor: "{colors.signal-indigo}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "40px"
  button-subtle-hover:
    backgroundColor: "{colors.signal-indigo-tint}"
    textColor: "{colors.signal-indigo-deep}"
  badge-status:
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "10px 12px"
  card-header:
    backgroundColor: "{colors.paper-band}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    padding: "5px 12px 4px"
  input-field:
    backgroundColor: "{colors.paper-band}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.lg}"
    padding: "10px"
  nav-item-active:
    backgroundColor: "{colors.signal-indigo-wash}"
    textColor: "{colors.signal-indigo}"
    rounded: "{rounded.xl}"
    padding: "8px 12px"
---

# Design System: MyPreflight

## Overview

**Creative North Star: "The Flight Plan"**

MyPreflight is dispatch and cockpit tooling for people who run a virtual airline for the realism of it. The interface
reads like the paperwork of a real operation — a flight plan, a loadsheet, a fuel log: exact figures, labelled units,
visible subtotals, nothing decorative between the reader and the number. The document *is* the interface, and its
authority comes from being correct and legible under density, not from chrome.

The system is precise, calm and document-grade. One indigo carries action and the current selection; everything else is
a disciplined, faintly cool gray scale that lets tabular data — fuel in tonnes, times in `Z`, IATA and ICAO codes — be
the loudest thing on the screen. Panels are flat paper on a gray canvas, separated by hairlines and tonal steps. Only
things that float above the page lift off it.

It rejects the flashy gamer and sci-fi HUD: no neon, no glows, no aggressive dark-mode theatrics, no fake-cockpit
skeuomorphism. Realism is earned through correct workflow and terminology, never simulated with visual gimmicks.

**Key Characteristics:**
- Document-grade: figures are the product — exact, unit-labelled, with the derivation shown.
- One signal colour: indigo means "act here" or "this is current", and nothing else.
- Flat paper on canvas: hairlines and tonal steps separate surfaces; overlays alone carry shadow.
- Dense but legible: built for scanning many values at once.
- Dual-theme: light and dark ship together and both hold WCAG 2.1 AA.

## Colors

A near-monochrome Ink and Paper scale with a single Signal Indigo and a conventional semantic quartet. The values are
Flowbite's palette, which replaces Tailwind's gray, indigo, green, red and blue scales; amber, sky and `gray-950` remain
Tailwind v4 colours.

### Primary
- **Signal Indigo** (`indigo-600`): fills the one primary action on a view, colours links, the active tab and its
  underline, and subtle buttons. White on it holds 5.56:1.
- **Signal Indigo Deep** (`indigo-700`): hover and pressed state of primary fills, hover text of secondary buttons, and
  indigo badge text.
- **Signal Indigo Mark** (`indigo-500`): the logo mark, the wordmark, progress fills, selection dots and the active
  rotation leg. Never put body text on it or white text over it — white on it is only 3.85:1.
- **Signal Indigo Light** (`indigo-400`): indigo text in dark mode.
- **Signal Indigo Wash** (`indigo-100`) and **Signal Indigo Tint** (`indigo-50`): the active sidebar item and indigo
  badge fill, and the quiet hover fill behind secondary actions.

### Neutral
- **Ink Strong** (`gray-900`): headings, flight numbers, airport codes and every headline figure.
- **Ink** (`gray-700`): values, secondary emphasis and the text of neutral buttons.
- **Muted** (`gray-500`): labels, units, captions and city lines. 4.83:1 on Paper and 4.63:1 on Paper Band; never go
  lighter for text.
- **Hairline** (`gray-200`): panel edges and dividers in light mode.
- **Paper** (`#ffffff`): cards, table rows and modals in light mode.
- **Paper Band** (`gray-50`): card header bands, empty-state wells and input fills.
- **Canvas** (`gray-100`): the app background in light mode.
- **Night Canvas** (`gray-950`), **Night Paper** (`gray-900`), **Night Band** (`gray-800`): the dark-mode canvas, card
  surface, and card header band and edge. **Night Muted** (`gray-400`) is muted text in dark mode, 6.99:1 on Night
  Paper.

### Semantic
- **Success** (`green-700` on `green-100`), **Warning** (`amber-700` on `amber-100`), **Info** (`sky-700` on `sky-100`),
  **Danger** (`red-700` on `red-100`): status badges, delay badges, limit warnings and emergencies, each above 4.5:1. Dark
  mode uses the `900/40` tint with `300`/`400` text. **Danger Stroke** (`red-600`) is the error border on fields.

### Named Rules
**The Rare Accent Rule.** Signal Indigo covers no more than a tenth of any screen — actions and the one current
selection. If two things on a panel are indigo, one of them is wrong.

**The Signal-Not-Decoration Rule.** Colour only ever means something: state, status or action. A limit breach or an
emergency needs a word or an icon beside the hue, and danger red never marks anything that is not a problem — "today" on
a heatmap is outlined in Ink Strong, not red.

**The Integration Brand Exception.** A third-party integration may carry its own brand hue, only on the marks that
identify it — its glyph and the ring around its account avatar — never on actions, text or surfaces. **Discord** and
**Discord Light** (for dark mode, since the base fails 4.5:1 on the dark canvas) are the only such tokens today. They sit
within a few percent of Signal Indigo, so the integration is recognised by its logo shape, not its hue.

## Typography

**Display / Body Font:** Noto Sans (with `sans-serif`)
**Data Font:** Roboto Mono (with `monospace`), for figures and codes only

**Character:** One humanist sans carries the whole interface — headings, labels, body and controls — so nothing competes
with the data. Anything a user compares or reads as a code switches to Roboto Mono with tabular figures, so digits align
in columns. Headings are bold rather than semibold; hierarchy comes from size and weight steps, not colour.

### Hierarchy
- **Display** (700, 1.875rem, 1.2): page and flight titles.
- **Headline** (700, 1.25rem, 1.4): panel section headings.
- **Title** (700, 1rem, 1.5): card and group titles, such as a rotation name.
- **Body** (400, 0.875rem, 1.43): default interface text; cap prose at 65–75ch, though dense tables may run wider.
- **Caption** (400, 0.75rem, 1.33): city lines, next-action captions and helper text, in Muted.
- **Label** (700, 0.6875rem, uppercase, 0.08em): field labels, column keys and card header titles.
- **Data** (Roboto Mono 700, 1rem, tabular): stat values, block times and every comparable figure. Registrations and
  secondary codes drop to 400 at caption size.
- **Data Display** (Roboto Mono 700, 1.875rem, line-height 1): flight numbers and airport codes on flight cards.

### Named Rules
**The Tabular Figures Rule.** Any number a user compares or sums is set in Roboto Mono with tabular figures,
right-aligned in columns, with the unit in a smaller, lighter weight. Never set comparable figures in the proportional
body font.

**The Micro-Caps Rule.** Uppercase tracked labels are the system's connective tissue. The project's `tracking-wide` is
0.06em and `tracking-wider` is 0.08em; never set caps tighter than 0.06em, and never use them for reading-length text.

**The Block-Time Rule.** A flight time names its event and its certainty. Label it with the block event — Off-block,
Takeoff, Arrival, On-block — and prefix "Est." or "Sched." unless it is the actual time. Before off-block a card shows
off-block; after off-block it shows on-block. Add the date (`03JAN 2025`) whenever the time is not today in UTC, and
never let the hyphen in "off-block" break across lines.

**The Wordmark Rule.** In prose the name is **MyPreflight**, one word, camel-cased. As a logotype beside the mark it is
**mypreflight**: all lowercase, `my` at 400 and `preflight` at 700, in Signal Indigo Mark. Render it with `Wordmark`
(`app/shared/ui/Wordmark.tsx`); never hand-set the logotype or bold the whole word.

## Layout

Content sits in a centred column capped at 1280px (`max-w-7xl`), with a 12px gutter on phones, 16px from 640px and 24px
from 768px. A persistent sidebar holds navigation from 768px up; below that, a floating top bar and a bottom navigation
bar take over, and the page pads itself clear of both, including safe-area insets.

Spacing runs on a 6 / 12 / 16 / 24px rhythm. Cards in a grid sit 12px apart; label-to-value pairs sit 6px apart. The
cabin crew dashboard steps from one column to two at 1024px and to three at 1280px, with the flight cards spanning two.
Density comes from tight groups inside cards, not from shrinking type.

On coarse pointers every control grows to at least 44px through `pointer-coarse:` variants — buttons to 44px tall, and
inline links gain vertical padding cancelled by negative margin, so the target grows without moving the layout.

## Elevation & Depth

Flat, with overlays that lift. A card is Paper on Canvas, separated by a 1px Hairline and a one-step tonal change; in dark
mode it is Night Paper on Night Canvas with a Night Band edge. Nothing at rest carries a shadow. Only things that float
above the page — modals and toasts — take a soft ambient shadow, and the modal shadow deepens in dark mode because it
sits on a near-black scrim.

### Shadow Vocabulary
- **Modal lift** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.06)`; dark
  `0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.4)`): a modal panel over its scrim.
- **Toast lift** (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): a toast floating over
  content.

### Named Rules
**The Flat Surface Rule.** Surfaces are flat at rest. Separate them with a 1px border and a tonal step, never a drop
shadow. Shadow belongs only to an overlay leaving the page.

## Shapes

Corners soften by size: 4px on heatmap tiles and inline focus targets, 8px on buttons, inputs, toasts and icon tiles,
12px on modals, sidebar items, inner panels and empty-state wells, and 16px on cards. Badges and status pills are fully
round. Cards clip their content to their corners, so anything drawn at a card's edge — a focus ring on a full-width
footer link — must sit inset, and on the corners it shares with the card it takes the card's radius minus the 1px
border (15px inside a 16px card), or the clip cuts the ring where the curve begins. Dashed hairlines mark empty and placeholder wells, and the route line between two airports.

## Components

Precise and tactile: familiar affordances, quiet at rest, with a slight press — controls scale to 0.96 on press over
150ms. Every interactive control ships default, hover, focus, active and disabled states.

### Buttons
- **Shape:** gently rounded (8px), 40px tall at the default size and 44px on touch screens.
- **Primary:** Signal Indigo fill with white text; hover goes to Signal Indigo Deep. For the one primary action on a
  view.
- **Alternative:** Paper fill, 1px Hairline border and Ink text; hover tints to Signal Indigo Tint with a light indigo
  border and Signal Indigo Deep text. For secondary actions, such as "Open them" and "New travel".
- **Subtle:** transparent, Signal Indigo text, tinting on hover. For low-emphasis links, such as "See all" and
  "History".
- **Focus:** a 2px indigo ring on every variant.

### Badges
- **Style:** fully round pills, uppercase, 0.06em tracking, bold, 11–12px, tint fill with saturated text.
- **State:** the semantic quartet, plus gray and indigo. A delay badge always reads as words — "+12m late" — never a bare
  number.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** Paper, or Night Paper in dark mode, with a 1px Hairline or Night Band edge and no shadow.
- **Header:** an optional band in Paper Band (Night Band in dark), carrying the title in Label type and Muted colour.
- **Internal Padding:** 10px by 12px at the condensed density the dashboard uses; 12px by 14px normal; 14px by 16px
  spacious.
- **Footer link:** a full-width row with an icon tile, a title and a one-line description, used through
  `CardFooterLink`. Its focus ring is inset, so the card's rounded clip cannot cut it.
- **Load failure:** a card whose data failed to load says so through `TilePlaceholder` — "Your last flight could not be
  loaded. Reload the page to try again." — never an empty state.

### Inputs / Fields
- **Style:** Flowbite floating-label inputs on a Paper Band fill with a `gray-300` stroke, 8px corners, 16px text on
  phones (to stop iOS zoom) and 14px from 640px.
- **Focus:** the border shifts to Signal Indigo Mark with an indigo ring.
- **Error / Disabled:** errors take Danger Stroke and a message below the field; disabled fields drop to half opacity.

### Navigation
- **Side nav:** stacked 14px links with 12px corners, Muted at rest, Signal Indigo Tint on hover, and Signal Indigo text
  on Signal Indigo Wash when active. In dark mode the active item is Night Band with white text.
- **Tabs:** the underline variant; the active tab is Signal Indigo text with an indigo underline, and the tab list
  scrolls sideways rather than wrapping.
- **Bottom navigation:** below 768px, with a raised pill for the current flight.

### Signature: The Fuel Build-up
The fuel and weight build-up (`FuelPlan`) is the system's defining pattern: a vertical ladder of Roboto Mono figures —
taxi, trip, contingency, reserves, then a **subtotal**, additions and the **total** — with hairline-ruled subtotals, a
running total and a slim tank-capacity gauge in Signal Indigo Mark. It embodies The Flight Plan: the derivation is
visible, so the operator can verify every tonne at a glance.

## Do's and Don'ts

### Do:
- **Do** set every comparable figure in Roboto Mono with tabular figures, unit-suffixed and column-aligned.
- **Do** label flight times with their block event and certainty (Est. off-block, Sched. on-block), and add the date when
  it is not today in UTC.
- **Do** keep Signal Indigo to one filled action per view; make the rest Alternative or Subtle.
- **Do** separate surfaces with a 1px border and a tonal step, and keep them flat.
- **Do** show the derivation of computed values — subtotals, running totals, build-ups.
- **Do** pair every status colour with a word or icon, and hold 4.5:1 for text in both themes.
- **Do** tell the user when data failed to load, and how to recover.
- **Do** give every control a 44px target on touch screens, and keep focus rings inset inside clipped cards.
- **Do** honour `prefers-reduced-motion`; keep state transitions around 150ms and entrances on
  `cubic-bezier(0.16, 1, 0.3, 1)`.

### Don't:
- **Don't** build a flashy gamer or sci-fi HUD — no neon, no glows, no aggressive dark-mode theatrics, no fake-cockpit
  skeuomorphism.
- **Don't** put white text on Signal Indigo Mark; fill buttons with Signal Indigo.
- **Don't** add drop shadows to cards or panels; only modals and toasts lift.
- **Don't** set Muted text any lighter, or use `gray-300` for anything a user must read.
- **Don't** let a second filled indigo button compete with the primary action.
- **Don't** show a failed request as an empty state, or a passed estimate as "now".
- **Don't** pulse or animate anything that is not changing.
- **Don't** reach for a modal by reflex — exhaust inline and progressive-disclosure alternatives first.
