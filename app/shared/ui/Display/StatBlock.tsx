import React from "react";
import { twMerge } from "tailwind-merge";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  label: string;
  value: React.ReactNode;
  unit?: string;
  mono?: boolean;
  align?: "left" | "right";
};

export function StatBlock({ label, value, unit, mono = true, align = "left" }: Props) {
  return (
    <div className={align === "right" ? "text-right" : undefined}>
      <FieldLabel>{label}</FieldLabel>
      <div
        className={twMerge(
          "mt-0.5 text-base font-bold text-gray-900 dark:text-gray-100",
          mono && "font-mono tabular-nums",
        )}
      >
        {value}
        {unit && <span className="ms-0.5 text-xs font-normal text-gray-500 dark:text-gray-400">{unit}</span>}
      </div>
    </div>
  );
}
