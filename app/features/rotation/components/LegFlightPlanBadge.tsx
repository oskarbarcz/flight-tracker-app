import { Badge } from "flowbite-react";
import React from "react";
import type { RotationLeg } from "~/features/rotation";

export type LegPlanState = "flown" | "current" | "ready" | "missing";

export function legPlanState(leg: RotationLeg, currentFlightId: string | null): LegPlanState {
  if (leg.isFlown) {
    return "flown";
  }
  if (!leg.flight) {
    return "missing";
  }
  return leg.flight.id === currentFlightId ? "current" : "ready";
}

const badges = {
  current: { color: "success", label: "Current" },
  ready: { color: "indigo", label: "F-PLN ready" },
  missing: { color: "gray", label: "No F-PLN yet" },
} as const;

type Props = {
  state: LegPlanState;
};

export function LegFlightPlanBadge({ state }: Props) {
  if (state === "flown") {
    return null;
  }

  const badge = badges[state];

  return (
    <Badge color={badge.color} size="xs">
      {badge.label}
    </Badge>
  );
}
