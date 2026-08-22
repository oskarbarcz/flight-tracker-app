import React from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { OsmShapePreview } from "~/features/airport/components/Enrichment/OsmShapePreview";
import { OsmValue } from "~/features/airport/components/Enrichment/OsmValue";
import { distanceInMetres } from "~/features/airport/lib/osmGeometry";
import { classifyOsmValue, formatOsmFieldName } from "~/features/airport/lib/osmProposal";
import { OsmChangeStatus, type OsmFieldChange, type OsmProposedChange } from "~/features/airport/model";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  change: OsmProposedChange;
};

function polygonOf(value: unknown) {
  const view = classifyOsmValue(value);
  return view.kind === "polygon" ? view.points : null;
}

function pointOf(value: unknown) {
  const view = classifyOsmValue(value);
  return view.kind === "point" ? view.point : null;
}

function DisplacementNote({ field }: { field: OsmFieldChange }) {
  const from = pointOf(field.current);
  const to = pointOf(field.proposed);
  if (from === null || to === null) {
    return null;
  }

  const metres = Math.round(distanceInMetres(from, to));

  return (
    <span className="text-xs text-gray-500 dark:text-gray-400">
      moved <span className="font-mono tabular-nums">{metres < 1 ? "<1" : metres.toLocaleString("en-US")}</span> m
    </span>
  );
}

function FieldBlock({ field, showCurrent }: { field: OsmFieldChange; showCurrent: boolean }) {
  const currentShape = polygonOf(field.current);
  const proposedShape = polygonOf(field.proposed);
  const hasShape = currentShape !== null || proposedShape !== null;

  return (
    <div className={hasShape ? "sm:col-span-2" : undefined}>
      <FieldLabel>{formatOsmFieldName(field.field)}</FieldLabel>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
        {showCurrent && (
          <>
            <OsmValue field={field.field} value={field.current} />
            <HiArrowNarrowRight className="size-3.5 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden={true} />
          </>
        )}
        <OsmValue field={field.field} value={field.proposed} />
        {showCurrent && <DisplacementNote field={field} />}
      </div>
      {hasShape && (
        <div className="mt-2">
          <OsmShapePreview current={currentShape} proposed={proposedShape} />
        </div>
      )}
    </div>
  );
}

export function OsmFieldDiff({ change }: Props) {
  const showCurrent = change.status === OsmChangeStatus.Updated;

  return (
    <div className="flex flex-col gap-3">
      {!showCurrent && <FieldLabel className="text-gray-400 dark:text-gray-500">From OpenStreetMap</FieldLabel>}

      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {change.fields.map((field) => (
          <FieldBlock key={field.field} field={field} showCurrent={showCurrent} />
        ))}
      </div>
    </div>
  );
}
