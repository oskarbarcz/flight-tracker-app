import type { LatLngTuple } from "leaflet";
import type { EtopsBriefing, OceanicTrack } from "~/features/route/model";
import { OceanicRouting } from "~/features/route/model";
import type { AssignedRunways } from "~/features/runway/hooks/useAssignedRunways";
import type { Runway } from "~/features/runway/model";
import { greatCirclePath } from "~/shared/lib/greatCircle";

export function flownTrack(briefing: EtopsBriefing): OceanicTrack | null {
  const { routing, trackId, tracks } = briefing.oceanicCrossing;

  if (routing === OceanicRouting.Random || trackId === null) {
    return null;
  }

  return tracks.find((track) => track.identifier === trackId) ?? null;
}

function threshold(runway: Runway | null): LatLngTuple | null {
  return runway === null ? null : [runway.coordinates.latitude, runway.coordinates.longitude];
}

export function routeLine(briefing: EtopsBriefing, runways: AssignedRunways): LatLngTuple[] {
  const fixes = briefing.route.fixes.map((fix): LatLngTuple => [fix.latitude, fix.longitude]);
  const start = threshold(runways.departure);
  const end = threshold(runways.arrival);

  return greatCirclePath(
    fixes.map((position, index) => {
      if (index === 0 && start !== null) {
        return start;
      }

      if (index === fixes.length - 1 && end !== null) {
        return end;
      }

      return position;
    }),
  );
}

export function trackLine(track: OceanicTrack | null): LatLngTuple[] {
  return greatCirclePath((track?.fixes ?? []).map((fix): LatLngTuple => [fix.latitude, fix.longitude]));
}
