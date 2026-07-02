/**
 * Architecture guardrails for the feature-based structure.
 * - `app/features/<domain>/` — self-contained domains.
 * - `app/shared/` — cross-cutting UI/lib/api/hooks/models; must NOT depend on features.
 * - `app/app-state/` — app-global React contexts.
 * - `app/routes/` — thin route entries that compose features.
 * Run: npm run depcruise
 */
module.exports = {
  forbidden: [
    {
      name: "no-legacy-layout",
      comment: "The old layer-first folders were removed. Do not reintroduce them; put code in a feature or shared/.",
      severity: "error",
      from: {},
      to: { path: "^app/(models|functions|validator|state)(/|$)" },
    },
    {
      name: "features-no-routes",
      comment: "Features must not import from app/routes. Routes compose features, not the other way around.",
      severity: "error",
      from: { path: "^app/features/" },
      to: { path: "^app/routes/" },
    },
    {
      name: "shared-no-features",
      comment: "shared/ is cross-cutting and must not depend on a feature (exception: shared/api composition root).",
      severity: "warn",
      from: { path: "^app/shared/", pathNot: "^app/shared/api/" },
      to: { path: "^app/features/" },
    },
    {
      name: "no-cross-feature-internals",
      comment: "Import another feature only through its index.ts, not its internal files.",
      severity: "warn",
      from: { path: "^app/features/([^/]+)/" },
      to: {
        path: "^app/features/([^/]+)/",
        pathNot: ["^app/features/$1/", "^app/features/[^/]+/index\\.(ts|tsx)$"],
      },
    },
    {
      name: "no-circular",
      comment: "Circular dependencies make the module graph fragile.",
      severity: "warn",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    exclude: { path: "(^|/)\\.react-router/|(^|/)build/" },
  },
};
