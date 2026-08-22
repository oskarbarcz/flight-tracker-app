import React from "react";
import { twMerge } from "tailwind-merge";
import { classifyOsmValue, osmFieldUnit } from "~/features/airport/lib/osmProposal";
import { formatCoordinates } from "~/shared/lib/formatGeo";

const TIGHT_UNITS = ["°"];

type Props = {
  field: string;
  value: unknown;
};

function Figure({ children, unit }: { children: React.ReactNode; unit?: string }) {
  return (
    <span className="font-mono tabular-nums text-gray-900 dark:text-gray-100">
      {children}
      {unit && (
        <span
          className={twMerge(
            "text-xs font-normal text-gray-500 dark:text-gray-400",
            !TIGHT_UNITS.includes(unit) && "ms-0.5",
          )}
        >
          {unit}
        </span>
      )}
    </span>
  );
}

export function OsmValue({ field, value }: Props) {
  const view = classifyOsmValue(value);
  const unit = osmFieldUnit(field);

  switch (view.kind) {
    case "empty":
      return (
        <span className="text-gray-400 dark:text-gray-500">
          <span aria-hidden={true}>—</span>
          <span className="sr-only">not set</span>
        </span>
      );
    case "number":
      return <Figure unit={unit}>{view.value.toLocaleString("en-US", { maximumFractionDigits: 4 })}</Figure>;
    case "text":
      return view.text.includes(" ") ? (
        <span className="text-gray-900 dark:text-gray-100">{view.text}</span>
      ) : (
        <Figure>{view.text}</Figure>
      );
    case "point":
      return <Figure>{formatCoordinates(view.point.latitude, view.point.longitude)}</Figure>;
    case "polygon":
      return <Figure unit={view.points.length === 1 ? "point" : "points"}>{view.points.length}</Figure>;
    case "codes":
      return <Figure>{view.codes.join(" · ")}</Figure>;
  }
}
