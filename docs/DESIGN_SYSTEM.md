# Flight Tracker — Tile Design System

A small, consistent kit for dashboard tiles and their controls. It is delivered as a **Flowbite theme extension** plus a restyled shared `Container`/`ContainerTitle`. There are no per-component wrappers around Flowbite — components like `Button`, `Card`, and `Badge` are restyled centrally through `createTheme`, so existing usage picks up the new look automatically.

---

## 1. Background & decisions

The dashboard tiles previously used a white card with a 1px indigo gradient bar on top. We replaced that chrome with a fresher, more professional treatment and formalised the surrounding pieces into a reusable system.

| Decision | Choice | Why |
| --- | --- | --- |
| Card chrome | **Hairline border + soft shadow** ("Option 1") | Crisp edge on any background, low dark-mode effort, reads as structured/professional. Rejected the borderless/elevated option because it depends on a tinted page background and needs extra dark-mode tuning. |
| Accent placement | Tinted icon **chip** in the header | Moves brand colour off a full-width bar into a smaller, intentional mark. |
| Colour source | **Tailwind's default palette** (`indigo`, `gray`, `green`, `amber`, `red`, `sky`) | Matches the rest of the app; no bespoke hex values to maintain. |
| Delivery | **Extend `app/styles/theme.ts`** via Flowbite `createTheme` + restyle the shared `Container` | Tiles update everywhere at once; no wrapper components. |
| Catalog | **Storybook 9** (`@storybook/react-vite`) | Living reference, light/dark toggle. |

---

## 2. Foundations

### Color
All colours are Tailwind defaults. The accent is **indigo**; neutrals are **gray**; state is carried by **green / amber / red / sky** and is reserved for status only (never decoration).

- Accent: `indigo-400 / 500 / 600`, tints `indigo-50 / 100`, dark text `indigo-300 / 400`
- Neutrals: `gray-50 → gray-950`
- Semantic: `green-*` (success / "you are here"), `amber-*` (pending / in transit), `red-*` (destructive), `sky-*` (info / dead-head)

### Type
System font stack (the app's default). Hierarchy comes from weight and letter-spacing, not many sizes:

- **Stat** — `text-3xl font-bold` (e.g. an IATA code)
- **Heading** — `text-xl font-bold`
- **Body** — `text-sm`
- **Label** — `text-xs font-bold uppercase tracking-widest` in `indigo-500`
- **Caption** — `text-xs font-semibold` in `gray-500`

### Shape, elevation & padding
- Card radius: **`rounded-2xl`** (16px)
- Card elevation: hairline `border-gray-200` + soft shadow `shadow-[0_1px_2px_rgb(15_23_42/0.04),0_6px_16px_-8px_rgb(15_23_42/0.12)]`; in dark mode the border carries the edge and the shadow is dropped (`dark:shadow-none`).
- Control radius: buttons/inputs `rounded-lg`; pills `rounded-full`
- Padding scale (unchanged API on `Container`): `condensed` = `p-4`, `normal` = `p-5`, `spacious` = `p-6`
- Inner gap between blocks: `gap-4`

---

## 3. Components

### Card chrome — shared `Container`
`app/components/shared/Layout/Container.tsx`

Drops the top gradient bar; applies hairline + soft shadow + `rounded-2xl`. Keeps the `padding="condensed | normal | spacious"` prop. Every tile that already uses `Container` (Next scheduled flight, Current flight, Pilot stats, etc.) inherits the new look automatically.

The same chrome is mirrored onto Flowbite's `Card` in `theme.ts` (`card.root.base` / `card.root.children`) so any direct `<Card>` usage matches.

### Header — `ContainerTitle`
`app/components/shared/Layout/ContainerTitle.tsx`

```tsx
<ContainerTitle icon={FaLocationDot} title="Current location" description="Updated 2 min ago" actions={<Button .../>} />
```

- `icon` is now **optional**; when present it renders a tinted indigo chip, otherwise the label stands alone.
- `description` (sub-line) and `actions` (right-aligned slot) are optional.

### Buttons — themed Flowbite `Button`
Restyled in `theme.ts` under `button.color`. Use the Flowbite component directly — no wrapper:

| Intent | `color` prop | Use |
| --- | --- | --- |
| Primary | `indigo` | One per tile, the main action |
| Ghost | `alternative` | Secondary |
| Subtle | `subtle` *(added)* | Low-emphasis links ("History", "View all") |
| Light | `light` | Neutral chip-like action |
| Danger | `red` | Destructive only |

Sizes use Flowbite's `size` (`xs` / `sm` / default / `lg`).

### Status pills — themed Flowbite `Badge`
Restyled in `theme.ts` under `badge` (rounded-full, uppercase, soft tint + readable text in both modes):

| `color` | Meaning |
| --- | --- |
| `success` | Finished |
| `warning` | Pending / in transit |
| `info` | Dead-head |
| `gray` | Automatic / neutral |
| `indigo` | Performing flight |

### Empty state — `ContainerEmptyState`
Quiet dashed placeholder on `bg-gray-50` (per house style). Used when a tile has no data.

---

## 4. How it's wired

- **Theme:** `app/styles/theme.ts` (`createTheme`) — Flowbite `button`, `card`, `badge` overrides plus the app's existing component tweaks. Applied once in `app/root.tsx` via `<ThemeProvider theme={theme()}>`.
- **Shared chrome:** `app/components/shared/Layout/` — `Container`, `ContainerTitle`, `ContainerEmptyState`.
- **No wrappers:** consumers import `Button` / `Card` / `Badge` straight from `flowbite-react`; the theme does the styling.

Example — the Current Location tile (`app/components/flight/Dashboard/Travel/CurrentLocationBox.tsx`) composes `Container` + `ContainerTitle` + a gradient location pin + `Button color="indigo" / "alternative"`; the Travel log table (`TravelLogListElement.tsx`) uses `<Badge color="success | warning | info | gray | indigo">`.

---

## 5. Future extraction

The system intentionally has a small surface so it can later move into its own repository/package:

1. Promote the tokens, `theme.ts`, and the `Layout` primitives into a `@flight-tracker/design-system` package.
2. Keep `flowbite-react`, `react`, `react-dom`, `tailwindcss` as peer dependencies.
3. The app would then consume `theme()` and the shared primitives from the package; everything else (themed Flowbite components) needs no changes because there are no wrappers to migrate.

Until then it lives in-repo under `app/components/shared/` and `app/styles/theme.ts`.
