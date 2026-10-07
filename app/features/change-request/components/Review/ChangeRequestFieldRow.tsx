import React, { useMemo } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { distanceInMetres } from "~/features/airport/lib/osmGeometry";
import { ChangeRequestValue } from "~/features/change-request/components/Review/ChangeRequestValue";
import {
  type Geometry,
  GeometryComparisonMap,
} from "~/features/change-request/components/Review/GeometryComparisonMap";
import type { ChangeRequestFieldSpec } from "~/features/change-request/lib/changeRequestFields";
import { isSameValue, pointOf, polygonOf } from "~/features/change-request/lib/changeRequestGeometry";
import type { ChangedField } from "~/features/change-request/model";

export const FIELD_GRID = "sm:grid-cols-[9rem_minmax(0,1fr)] lg:grid-cols-[11rem_minmax(0,1fr)]";
export const VALUE_GRID = "grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)]";

type Props = {
  field: ChangedField;
  spec: ChangeRequestFieldSpec;
  isPending: boolean;
};

function geometryOf(value: unknown): Geometry | null {
  const point = pointOf(value);
  if (point) return { kind: "point", point };
  const points = polygonOf(value);
  if (points) return { kind: "polygon", points };
  return null;
}

function DisplacementNote({ current, proposed }: { current: Geometry | null; proposed: Geometry | null }) {
  if (current?.kind !== "point" || proposed?.kind !== "point") {
    return null;
  }

  const metres = Math.round(distanceInMetres(current.point, proposed.point));

  return (
    <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
      Moves{" "}
      <span className="font-mono tabular-nums text-gray-700 dark:text-gray-300">
        {metres < 1 ? "<1" : metres.toLocaleString("en-US")}
      </span>{" "}
      m
    </span>
  );
}

export function ChangeRequestFieldRow({ field, spec, isPending }: Props) {
  const isGeometry = spec.format === "point" || spec.format === "polygon";
  const current = useMemo(() => (isGeometry ? geometryOf(field.current) : null), [isGeometry, field.current]);
  const proposed = useMemo(() => (isGeometry ? geometryOf(field.proposed) : null), [isGeometry, field.proposed]);
  const isUnchanged = isSameValue(field.current, field.proposed);
  const isAlreadySet = isPending && isUnchanged;

  return (
    <div className={`grid grid-cols-1 gap-x-3 gap-y-1.5 px-3.5 py-3 ${FIELD_GRID}`}>
      <dt className="text-sm font-medium text-gray-700 dark:text-gray-200">{spec.label}</dt>
      <dd className="flex min-w-0 flex-col gap-3">
        <div className={`grid items-start gap-x-3 text-sm ${VALUE_GRID}`}>
          <div className="min-w-0 break-words">
            <span className="sr-only">Now: </span>
            <ChangeRequestValue spec={spec} value={field.current} label={field.currentLabel} tone="current" />
          </div>
          {isUnchanged ? (
            <span aria-hidden={true} className="text-center font-mono text-sm text-gray-500 dark:text-gray-400">
              =
            </span>
          ) : (
            <HiArrowNarrowRight aria-hidden={true} className="mt-0.5 size-4 text-gray-500 dark:text-gray-400" />
          )}
          <div className="min-w-0 break-words">
            <span className="sr-only">Proposed: </span>
            <ChangeRequestValue spec={spec} value={field.proposed} label={field.proposedLabel} tone="proposed" />
            {isAlreadySet && <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">Already set</span>}
            {!isAlreadySet && <DisplacementNote current={current} proposed={proposed} />}
          </div>
        </div>
        {(current || proposed) && <GeometryComparisonMap title={spec.label} current={current} proposed={proposed} />}
      </dd>
    </div>
  );
}
