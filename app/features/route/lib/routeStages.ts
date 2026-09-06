import type { PlannedRouteFix } from "~/features/route/model";

const CRUISE_STAGE = "CRZ";

export function cruiseFixes(fixes: PlannedRouteFix[]): PlannedRouteFix[] {
  return fixes.filter((fix) => fix.stage.toUpperCase() === CRUISE_STAGE);
}
