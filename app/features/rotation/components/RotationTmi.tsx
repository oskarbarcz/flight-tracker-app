import React from "react";
import { padZero } from "~/shared/lib/time";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

function dayOfYear(date: Date): number {
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.round((today - startOfYear) / 86_400_000);
}

export function RotationTmi() {
  const tmi = dayOfYear(new Date());

  return (
    <div className="flex items-baseline gap-2">
      <FieldLabel>TMI</FieldLabel>
      <span className="font-mono text-sm font-bold tabular-nums text-gray-900 dark:text-white">{padZero(tmi, 3)}</span>
    </div>
  );
}
