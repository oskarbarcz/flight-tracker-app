# Codebase Context Summary

## 1. Tailwind CSS Configuration
- **Location**: The project uses **Tailwind CSS v4** (`@tailwindcss/vite`), so there is no traditional `tailwind.config.ts`.
- Configuration happens inside `app/styles/index.css` using the new `@theme` directive.
- Imports include `tailwindcss-safe-area`, `tw-animate-css`, `flowbite-react` plugins, and custom stylesheets (`base.css`, `animations.css`, `utilities.css`, `scrollbars.css`).

## 2. Typography, Spacing, and Design Tokens
- **Typography**: The default font is **Inter** (`--font-display: "Inter", sans-serif`). Monospace text uses **Roboto Mono**.
- **Colors & Spacing**: The app relies heavily on default Tailwind V4 and Flowbite React tokens. Custom CSS overrides apply primarily to Leaflet maps and `.airport-marker` classes (in `app/styles/utilities.css`).
- Dark mode is configured using the `.dark` class strategy (`@custom-variant dark`).

## 3. Component Naming Conventions
- **Folders**: PascalCase for component directories (e.g., `app/components/shared/Sidebar`, `Form`, `Layout`, etc.).
- **Filenames**: PascalCase for React component files (e.g., `Sidebar.tsx`, `SidebarLogo.tsx`).
- **Exports**: The codebase uses **named exports** instead of default exports (e.g., `export function Sidebar() { ... }`).

## 4. Biome Configuration
- Configured in `biome.json`.
- **Indentation**: `space`.
- **Line Width**: `120` characters.
- **Quotes**: Double quotes (`"quoteStyle": "double"` for JSX and general formatting).
- Formatting and recommended linter rules are enabled.

## 5. UserRole Enum Definition
- Located in `app/models/user.model.tsx`.
- Defined as:
  ```typescript
  export enum UserRole {
    Operations = "Operations",
    Admin = "Admin",
    CabinCrew = "CabinCrew",
  }
  ```

## 6. React Router v7 Route Structure
- Configured centrally in `app/routes.ts`.
- Uses layout/route compositional patterns (`layout()`, `route()`, `index()`).
- High-level layout wrappers include:
  - `AuthLayout` (SignIn, SignOut)
  - `MapLayout` (Public Map)
  - `AppLayout` (Main app wrapper containing DashboardRoute)
  - `PilotLayout` & `OperationsLayout` (Nested Layouts for specific roles/features)

## 7. Shared UI Primitives
- **Library**: The app natively uses **Flowbite React** (`flowbite-react`) for fundamental UI primitives (e.g., `Drawer`, buttons, inputs, components in classes `.flowbite-react`).
- **Custom abstractions**: Grouped in `app/components/shared/`, containing robust managed form blocks (`ManagedDateTimeInputBlock`, `ManagedFloatingInputBlock`), `Layout` wrappers (like `Container`), `Sidebar` elements, and other functional abstractions.
