import React from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { fuelReportStanding } from "~/features/route/lib/fuelReportStanding";
import type { PlannedRouteFix } from "~/features/route/model";

const LABEL = "Below minimum fuel";

export function BelowMinimumIcon({ fix }: { fix: PlannedRouteFix }) {
  if (fuelReportStanding(fix) !== "belowMinimum") {
    return null;
  }

  return <FaTriangleExclamation role="img" aria-label={LABEL} title={LABEL} className="me-1 inline size-3" />;
}
