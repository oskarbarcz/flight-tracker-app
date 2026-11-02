import type { LatLngTuple } from "leaflet";
import { translateEtopsPointKindShort } from "~/features/route/i18n";
import { fixName, isEqualTimePoint, pseudoFixName } from "~/features/route/lib/fixName";
import type { FixInsight } from "~/features/route/lib/routeInsights";
import type { EtopsPoint } from "~/features/route/model";

export type RouteFixMark = {
  key: string;
  ordinal: number | null;
  name: string;
  etops: boolean;
  position: LatLngTuple;
};

function navlogMark({ fix }: FixInsight): RouteFixMark {
  return {
    key: `fix-${fix.ordinal}`,
    ordinal: fix.ordinal,
    name: fixName(fix.ident),
    etops: isEqualTimePoint(fix.ident),
    position: [fix.latitude, fix.longitude],
  };
}

function etopsMark(point: EtopsPoint): RouteFixMark {
  return {
    key: `etops-${point.kind}-${point.ordinal}`,
    ordinal: null,
    name: pseudoFixName(translateEtopsPointKindShort(point.kind)),
    etops: true,
    position: [point.position.latitude, point.position.longitude],
  };
}

export function fixLabelClassName(mark: RouteFixMark): string {
  return mark.etops ? "map-fix-label map-fix-label--etops" : "map-fix-label";
}

export function routeFixMarks(insights: FixInsight[], points: EtopsPoint[]): RouteFixMark[] {
  return [...insights.map(navlogMark), ...points.map(etopsMark)];
}
