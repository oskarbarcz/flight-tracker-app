import { Badge } from "flowbite-react";
import React from "react";
import type { Delta } from "~/features/stats/lib/delta";

type Props = {
  delta: Delta;
  format: (value: number) => string;
};

export function DeltaBadge({ delta, format }: Props) {
  if (delta.kind === "noActivity") {
    return null;
  }

  if (delta.kind === "noBaseline") {
    return (
      <Badge color="gray" size="xs" className="shrink-0">
        No earlier data
      </Badge>
    );
  }

  if (delta.kind === "unchanged") {
    return (
      <Badge color="gray" size="xs" className="shrink-0">
        No change
      </Badge>
    );
  }

  const rising = delta.direction === "up";
  const amount = delta.kind === "percentage" ? `${delta.percent.toFixed(0)}%` : format(delta.difference);

  return (
    <Badge color={rising ? "success" : "warning"} size="xs" className="shrink-0 whitespace-nowrap">
      {`${rising ? "+" : "\u2212"}${amount}`}
    </Badge>
  );
}
