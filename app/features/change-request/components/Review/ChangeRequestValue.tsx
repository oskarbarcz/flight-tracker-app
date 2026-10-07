import React from "react";
import { twMerge } from "tailwind-merge";
import type { ChangeRequestFieldSpec } from "~/features/change-request/lib/changeRequestFields";
import { pointOf, polygonOf } from "~/features/change-request/lib/changeRequestGeometry";
import { formatCoordinates } from "~/shared/lib/formatGeo";
import { CountryFlag } from "~/shared/ui/Display/CountryFlag";

export type ValueTone = "current" | "proposed";

type Props = {
  spec: ChangeRequestFieldSpec;
  value: unknown;
  label?: string | null;
  tone: ValueTone;
};

const TIGHT_UNITS = ["°"];

const TONE_CLASS: Record<ValueTone, string> = {
  current: "text-gray-600 dark:text-gray-300",
  proposed: "font-semibold text-gray-900 dark:text-white",
};

function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

function Empty() {
  return (
    <span className="text-gray-500 dark:text-gray-400">
      <span aria-hidden={true}>—</span>
      <span className="sr-only">not set</span>
    </span>
  );
}

function Figure({ children, unit, tone }: { children: React.ReactNode; unit?: string; tone: ValueTone }) {
  return (
    <span className={twMerge("font-mono tabular-nums", TONE_CLASS[tone])}>
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

function ReferenceValue({ label, spec, tone }: Omit<Props, "value">) {
  if (label === null || label === undefined) {
    return <span className="text-gray-500 italic dark:text-gray-400">Deleted record</span>;
  }
  return spec.format === "code" ? (
    <Figure tone={tone}>{label}</Figure>
  ) : (
    <span className={TONE_CLASS[tone]}>{label}</span>
  );
}

export function ChangeRequestValue({ spec, value, label, tone }: Props) {
  if (isEmpty(value)) {
    return <Empty />;
  }

  if (spec.isReference) {
    return <ReferenceValue spec={spec} label={label} tone={tone} />;
  }

  switch (spec.format) {
    case "number":
      return (
        <Figure unit={spec.unit} tone={tone}>
          {typeof value === "number" ? value.toLocaleString("en-US", { maximumFractionDigits: 4 }) : String(value)}
        </Figure>
      );
    case "code":
    case "time":
      return <Figure tone={tone}>{String(value)}</Figure>;
    case "codes":
      return <Figure tone={tone}>{Array.isArray(value) ? value.map(String).join(" · ") : String(value)}</Figure>;
    case "country":
      return (
        <span className="inline-flex items-center gap-1.5">
          <CountryFlag code={String(value)} name={String(value)} />
          <Figure tone={tone}>{String(value)}</Figure>
        </span>
      );
    case "point": {
      const point = pointOf(value);
      return point ? <Figure tone={tone}>{formatCoordinates(point.latitude, point.longitude)}</Figure> : <Empty />;
    }
    case "polygon": {
      const polygon = polygonOf(value);
      return polygon ? (
        <Figure unit={polygon.length === 1 ? "point" : "points"} tone={tone}>
          {polygon.length}
        </Figure>
      ) : (
        <Empty />
      );
    }
    case "prose":
      return <span className={twMerge("whitespace-pre-line font-normal", TONE_CLASS[tone])}>{String(value)}</span>;
    case "text":
      return <span className={TONE_CLASS[tone]}>{spec.translate ? spec.translate(String(value)) : String(value)}</span>;
  }
}
