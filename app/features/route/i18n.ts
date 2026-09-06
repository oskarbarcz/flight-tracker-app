import { EtopsPointKind, OceanicDirection, OceanicRouting } from "~/features/route/model";

export function translateEtopsPointKind(kind: EtopsPointKind): string {
  const labels: Record<EtopsPointKind, string> = {
    [EtopsPointKind.Entry]: "Entry point",
    [EtopsPointKind.Exit]: "Exit point",
    [EtopsPointKind.EqualTime]: "Equal-time point",
    [EtopsPointKind.Critical]: "Critical point",
  };

  return labels[kind];
}

export function translateEtopsPointKindShort(kind: EtopsPointKind): string {
  const labels: Record<EtopsPointKind, string> = {
    [EtopsPointKind.Entry]: "ETP IN",
    [EtopsPointKind.Exit]: "ETP OUT",
    [EtopsPointKind.EqualTime]: "ETP",
    [EtopsPointKind.Critical]: "CP",
  };

  return labels[kind];
}

export function translateOceanicRouting(routing: OceanicRouting): string {
  const labels: Record<OceanicRouting, string> = {
    [OceanicRouting.Track]: "Filed on track",
    [OceanicRouting.TrackGeometry]: "Track waypoints, not cleared on track",
    [OceanicRouting.Random]: "Random routing",
  };

  return labels[routing];
}

export function translateOceanicDirection(direction: OceanicDirection): string {
  const labels: Record<OceanicDirection, string> = {
    [OceanicDirection.East]: "Eastbound",
    [OceanicDirection.West]: "Westbound",
  };

  return labels[direction];
}
