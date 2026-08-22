import { allOsmResources, OsmChangeStatus, type OsmProposedChange, type OsmResource } from "~/features/airport/model";
import type { Coordinates } from "~/shared/models/coordinates";

const FIELD_LABEL_OVERRIDES: Record<string, string> = {
  displace: "Displaced threshold",
  gpu: "GPU",
  pca: "PCA",
  text: "Notes",
};

const FIELD_UNITS: Record<string, string> = {
  averageTaxiTime: "min",
  displace: "m",
  elevation: "m",
  length: "m",
  magneticHeading: "°",
  trueHeading: "°",
  width: "m",
};

const STATUS_ORDER: OsmChangeStatus[] = [
  OsmChangeStatus.Added,
  OsmChangeStatus.Updated,
  OsmChangeStatus.Removed,
  OsmChangeStatus.NotChanged,
];

export const WRITING_STATUSES: OsmChangeStatus[] = [
  OsmChangeStatus.Added,
  OsmChangeStatus.Updated,
  OsmChangeStatus.Removed,
];

export type OsmResourceGroup = {
  resource: OsmResource;
  changes: OsmProposedChange[];
  writingCount: number;
};

export type OsmValueView =
  | { kind: "empty" }
  | { kind: "text"; text: string }
  | { kind: "number"; value: number }
  | { kind: "point"; point: Coordinates }
  | { kind: "polygon"; points: Coordinates[] }
  | { kind: "codes"; codes: string[] };

export function formatOsmFieldName(field: string): string {
  const override = FIELD_LABEL_OVERRIDES[field];
  if (override) {
    return override;
  }

  const spaced = field.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function osmFieldUnit(field: string): string | undefined {
  return FIELD_UNITS[field];
}

export function writesRecords(change: OsmProposedChange): boolean {
  return change.status !== OsmChangeStatus.NotChanged;
}

function isCoordinates(value: unknown): value is Coordinates {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Coordinates).latitude === "number" &&
    typeof (value as Coordinates).longitude === "number"
  );
}

export function classifyOsmValue(value: unknown): OsmValueView {
  if (value === null || value === undefined || value === "") {
    return { kind: "empty" };
  }

  if (typeof value === "number") {
    return { kind: "number", value };
  }

  if (typeof value === "string") {
    return { kind: "text", text: value };
  }

  if (isCoordinates(value)) {
    return { kind: "point", point: value };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { kind: "empty" };
    }
    if (value.every(isCoordinates)) {
      return { kind: "polygon", points: value };
    }
    return { kind: "codes", codes: value.map((item) => String(item)) };
  }

  return { kind: "text", text: JSON.stringify(value) };
}

export function groupProposalByResource(changes: OsmProposedChange[]): OsmResourceGroup[] {
  return allOsmResources()
    .map((resource) => {
      const owned = changes
        .filter((change) => change.resource === resource)
        .sort((left, right) => STATUS_ORDER.indexOf(left.status) - STATUS_ORDER.indexOf(right.status));

      return {
        resource,
        changes: owned,
        writingCount: owned.filter(writesRecords).length,
      };
    })
    .filter((group) => group.changes.length > 0);
}

function indexByKey(changes: OsmProposedChange[]): Map<string, OsmProposedChange> {
  return new Map(changes.map((change) => [change.key, change]));
}

function collectRequirements(index: Map<string, OsmProposedChange>, key: string, collected: Set<string>): void {
  for (const required of index.get(key)?.requires ?? []) {
    if (collected.has(required) || !index.has(required)) {
      continue;
    }
    collected.add(required);
    collectRequirements(index, required, collected);
  }
}

function collectDependents(changes: OsmProposedChange[], dropped: Set<string>): Set<string> {
  const dependents = new Set(dropped);
  let expanded = true;

  while (expanded) {
    expanded = false;
    for (const change of changes) {
      if (dependents.has(change.key)) {
        continue;
      }
      if (change.requires.some((required) => dependents.has(required))) {
        dependents.add(change.key);
        expanded = true;
      }
    }
  }

  return dependents;
}

export function selectChanges(
  changes: OsmProposedChange[],
  selected: ReadonlySet<string>,
  keys: string[],
): Set<string> {
  const index = indexByKey(changes);
  const next = new Set(selected);

  for (const key of keys) {
    const change = index.get(key);
    if (change === undefined || !writesRecords(change)) {
      continue;
    }
    next.add(key);
    const requirements = new Set<string>();
    collectRequirements(index, key, requirements);
    for (const requirement of requirements) {
      next.add(requirement);
    }
  }

  return next;
}

export function deselectChanges(
  changes: OsmProposedChange[],
  selected: ReadonlySet<string>,
  keys: string[],
): Set<string> {
  const dropped = collectDependents(changes, new Set(keys));
  return new Set([...selected].filter((key) => !dropped.has(key)));
}

export function changesWithStatus(changes: OsmProposedChange[], status: OsmChangeStatus): OsmProposedChange[] {
  return changes.filter((change) => change.status === status);
}
