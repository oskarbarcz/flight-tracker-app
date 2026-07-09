---
name: Flight Tracker
description: Operations and cockpit tooling for a virtual airline — precise, dependable, document-grade.
colors:
  indigo-primary: "#6366f1"
  indigo-strong: "#4f46e5"
  indigo-tint: "#eef2ff"
  indigo-mark: "#6875f5"
  ink: "#1f2937"
  ink-strong: "#111827"
  muted: "#6b7280"
  border: "#e5e7eb"
  surface: "#ffffff"
  canvas: "#f3f4f6"
  canvas-subtle: "#f9fafb"
  dark-canvas: "#111827"
  dark-surface: "#1f2937"
  dark-border: "#374151"
  success: "#15803d"
  warning: "#b45309"
  info: "#0369a1"
  danger: "#dc2626"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  data:
    fontFamily: "Roboto Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
components:
  button-primary:
    backgroundColor: "{colors.indigo-primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.indigo-strong}"
    textColor: "{colors.surface}"
  button-subtle:
    backgroundColor: "{colors.indigo-tint}"
    textColor: "{colors.indigo-strong}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
  badge-status:
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0.125rem 0.625rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "20px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0.625rem 0.75rem"
---

# Design System: Flight Tracker

## 1. Overview

**Creative North Star: "The Flight Plan"**

Flight Tracker is dispatch and cockpit tooling for people who run a virtual airline for the realism of it. The interface should read like the paperwork of a real operation — a flight plan, a loadsheet, a fuel log: exact figures, labeled units, visible subtotals, nothing decorative between the reader and the number. The document *is* the interface. Its authority comes from being correct and legible under density, not from chrome.

The system is quiet on purpose. A single indigo carries action and current selection; everything else is a disciplined gray scale that lets tabular data (fuel in tons, times in `Z`, IATA/ICAO codes) be the loudest thing on the screen. Layout is structural and honest: panels separated by hairline borders and tonal steps, information packed tightly but never cramped, hierarchy built from weight and rhythm rather than empty space.

This system explicitly rejects the **flashy gamer / sci-fi HUD**: no neon, no glows, no aggressive dark-mode theatrics, no fake-cockpit skeuomorphism. Realism is earned through accurate workflow and terminology, never simulated with visual gimmickry. It equally rejects playful consumer-SaaS softness — this is a tool for a task, not a toy.

**Key Characteristics:**
- Document-grade: figures are the product; present them exactly, unit-labeled, with derivations shown.
- Restrained color: indigo for action and selection only; gray does the structural work.
- Flat and honest: borders and tone convey depth, not shadow.
- Dense but legible: built for scanning many values at once.
- Dual-theme: light and dark ship together and both hold WCAG 2.1 AA.

## 2. Colors

A near-monochrome gray system with one indigo accent and a conventional semantic quartet. Color is a signal, never decoration.

### Primary
- **Instrument Indigo** (`#6366f1`, `indigo-500`): the single brand accent. Primary buttons, the active tab underline, current selection, progress, focus rings. Its scarcity is what makes it read as "act here."
- **Indigo Deep** (`#4f46e5`, `indigo-600`): hover/pressed state of primary actions.
- **Indigo Tint** (`#eef2ff`, `indigo-50`): quiet fill behind subtle/ghost actions and selected pagination.
- **Mark Indigo** (`#6875f5`): the logo mark's specific hue; brand identity only, not a UI token.

### Neutral
- **Ink** (`#1f2937`, `gray-800`): primary body text in light mode.
- **Ink Strong** (`#111827`, `gray-900`): the darkest text and the dark-mode canvas.
- **Muted** (`#6b7280`, `gray-500`): secondary text, labels, units. Meets 4.5:1 on white and on `canvas-subtle`; do not go lighter for body-length text.
- **Border** (`#e5e7eb`, `gray-200`): hairline dividers and panel edges in light mode.
- **Surface** (`#ffffff`): cards, modals, table rows in light mode.
- **Canvas** (`#f3f4f6`, `gray-100`): the app background in light mode.
- **Canvas Subtle** (`#f9fafb`, `gray-50`): table headers and empty-state placeholders.
- **Dark Surface** (`#1f2937`, `gray-800`) / **Dark Border** (`#374151`, `gray-700`): the dark-mode equivalents of surface and border; the dark canvas is Ink Strong.

### Semantic
- **Success** (`#15803d`, `green-700`), **Warning** (`#b45309`, `amber-700`), **Info** (`#0369a1`, `sky-700`), **Danger** (`#dc2626`, `red-600`): status badges, limit warnings, emergencies. Each ships a light tint background + saturated text in light mode, and a `900/40` tint + light text in dark. Always pair with a text or icon cue.

### Named Rules
**The Rare Accent Rule.** Instrument Indigo appears on ≤10% of any screen — actions and the one current selection. If two things on a panel are indigo, one of them is wrong.

**The Signal-Not-Decoration Rule.** Color only ever means something (state, status, action). Never encode meaning in hue alone — a limit breach or emergency needs a word or icon beside the color.

## 3. Typography

**Display / Body Font:** Inter (with `sans-serif` fallback), optical sizing on.
**Data Font:** Roboto Mono (with `monospace` fallback), for figures only.

**Character:** One humanist sans carries the entire UI — headings, labels, body, controls — so nothing competes with the data. Numbers that must be scanned and compared (weights, fuel, times) switch to Roboto Mono with tabular figures so digits align in columns. The type scale is a fixed rem scale, never fluid: users view at consistent DPI and a shrinking heading in a sidebar helps no one.

### Hierarchy
- **Display** (Inter 700, 1.875rem, 1.15): flight/page titles (e.g. the flight number header).
- **Headline** (Inter 700, 1.25rem, 1.3): panel section headings ("Souls on board", "Fuel plan").
- **Title** (Inter 600, 1rem, 1.4): card and group titles.
- **Body** (Inter 400, 0.875rem/14px, 1.5): default UI text; cap prose at 65–75ch, though dense tables may run wider.
- **Label** (Inter 700, ~0.6875rem/11px, uppercase, `letter-spacing: 0.08em`): the small tracked caps used for field labels and column keys ("PILOTS", "TRACKING", "EN-ROUTE & RESERVES").
- **Data** (Roboto Mono 500, 0.875rem, `tabular-nums`): every figure — tonnages, fuel, times, subtotals, running totals.

### Named Rules
**The Tabular Figures Rule.** Any number a user compares or sums is set in Roboto Mono with `tabular-nums`, right-aligned in columns, unit suffix in a smaller muted weight. Never set comparable figures in the proportional body font.

**The Micro-Caps Rule.** Uppercase tracked labels are the system's connective tissue; keep tracking ≥ 0.06em so caps never touch, and never use them for reading-length text.

## 4. Elevation

Flat by default. Depth is built from **hairline borders and tonal steps**, not shadow: a panel is a `surface` on `canvas` separated by a 1px `border`; in dark mode the same separation is a `dark-surface` on the darker canvas with a `dark-border`. This matches how dark mode already behaves everywhere and how the app shell, tables, and data panels read. New surfaces follow the flat rule.

### Shadow Vocabulary
Effectively none. Modals may carry a single soft ambient shadow to lift them off the backdrop — that is the only sanctioned shadow. (The card component currently ships a faint two-layer light-mode shadow; treat it as legacy and prefer border-based separation going forward.)

### Named Rules
**The Flat Surface Rule.** Surfaces are flat at rest. Separate them with a 1px border and a one-step tonal change, never a drop shadow. The only exception is a modal lifting off its backdrop.

## 5. Components

Refined and restrained: familiar affordances, quiet at rest, indigo reserved for action and selection. Every interactive control ships default, hover, focus, active, and disabled — never half of them.

### Buttons
- **Shape:** gently rounded (`8px`, `rounded-lg`), `transition-colors` 200ms.
- **Primary:** Instrument Indigo fill, white text; hover → Indigo Deep. Focus ring `indigo-300`. For the one primary action on a view.
- **Subtle / ghost:** transparent or Indigo Tint fill, indigo text; for secondary indigo actions.
- **Alternative / light:** gray fill (`gray-200`/`gray-100`), ink text; for neutral secondary actions.
- **Outline:** indigo or gray tinted-fill outline variants for tertiary actions.

### Badges
- **Style:** pill (`rounded-full`), uppercase, `tracking-wide`, bold, `11–12px`.
- **State:** semantic color families (success/warning/info/danger) plus neutral gray and indigo; tint background + saturated text, always with a word, not color alone.

### Cards / Containers
- **Corner Style:** `16px` (`rounded-2xl`) for cards, `12px` (`rounded-xl`) for modals and inner data panels.
- **Background:** `surface` (light) / `dark-surface` (dark).
- **Separation:** 1px `border`; no shadow (see Elevation).
- **Internal Padding:** `20px` cards; `16px` inner panels.

### Inputs / Fields
- **Style:** Flowbite floating-label inputs — label rests inside, floats up on focus/value. `rounded-lg`, `surface` background, `border` stroke.
- **Focus:** border shifts to indigo with an indigo focus ring.
- **Disabled:** `opacity-50`, `gray-50` (light) / `gray-700` (dark) fill, `cursor-not-allowed`.
- **Error:** message below the field; never rely on red border alone.

### Navigation
- **Side nav** (app shell): stacked links, muted at rest, indigo/ink on active; collapses behind a menu button on small screens.
- **Tabs:** underline variant; active tab is indigo text + indigo underline; tablist scrolls horizontally when it overflows rather than wrapping.

### Signature: The Fuel Build-up
The fuel and weight build-up (`FuelPlan`) is the system's defining pattern: a vertical ladder of Roboto Mono figures — taxi, trip, contingency, reserves → **subtotal** → additions → **total** — with rule-lined subtotals and a running total, plus a slim tank-capacity gauge. It embodies "The Flight Plan": the derivation is visible, so the operator can verify every tonne at a glance.

## 6. Do's and Don'ts

### Do:
- **Do** set every comparable figure in Roboto Mono with `tabular-nums`, unit-suffixed and column-aligned.
- **Do** keep Instrument Indigo to ≤10% of a screen — action and current selection only.
- **Do** separate surfaces with a 1px border and a tonal step; keep them flat.
- **Do** show the derivation of computed values (subtotals, running totals, build-ups) so numbers are verifiable.
- **Do** pair every status color with a word or icon, and hold 4.5:1 body-text contrast in both light and dark.
- **Do** honor `prefers-reduced-motion`; keep transitions in the 150–250ms state-change band.

### Don't:
- **Don't** build a flashy gamer / sci-fi HUD — no neon, no glows, no aggressive dark-mode theatrics, no fake-cockpit skeuomorphism.
- **Don't** add drop shadows to separate panels; use borders and tone (modals lifting off the backdrop are the sole exception).
- **Don't** use muted gray (`gray-400`/lighter) for body-length text on tinted near-white surfaces — it fails contrast; keep body text at Ink or Muted.
- **Don't** set numbers a user compares or sums in the proportional body font.
- **Don't** reach for a modal by reflex — exhaust inline and progressive-disclosure alternatives first.
- **Don't** encode meaning in color alone (a red border with no label is not a message).
- **Don't** let a second element compete with the primary indigo action on a view.
