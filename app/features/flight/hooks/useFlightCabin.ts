import { useEffect, useState } from "react";
import type { CabinSeatMap } from "~/features/cabin-layout/model";
import { type Flight, type FlightManifest, FlightServiceType, FlightStatus } from "~/features/flight";
import { useApi } from "~/shared/api/useApi";

export type ManifestGap = "cargo" | "not-released" | "no-layout" | "forbidden" | "failed";

export type FlightCabin =
  | { status: "loading" }
  | { status: "unavailable"; gap: ManifestGap }
  | { status: "ready"; manifest: FlightManifest; seatMap: CabinSeatMap | null };

const FORBIDDEN = 403;
const NOT_FOUND = 404;

function gapOf(reason: unknown, status: FlightStatus): ManifestGap {
  const statusCode = (reason as { statusCode?: number }).statusCode;

  if (statusCode === FORBIDDEN) {
    return "forbidden";
  }
  if (statusCode === NOT_FOUND) {
    return status === FlightStatus.Created ? "not-released" : "no-layout";
  }
  return "failed";
}

export function useFlightCabin(flight: Flight | null): FlightCabin {
  const { flightService, cabinLayoutService } = useApi();
  const [state, setState] = useState<FlightCabin>({ status: "loading" });

  const flightId = flight?.id ?? null;
  const flightStatus = flight?.status ?? null;
  const serviceType = flight?.serviceType ?? null;

  useEffect(() => {
    if (flightId === null || flightStatus === null || serviceType === null) {
      return;
    }

    if (serviceType === FlightServiceType.Cargo) {
      setState({ status: "unavailable", gap: "cargo" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    flightService
      .fetchManifestByFlightId(flightId)
      .then(async (manifest) => {
        const seatMap = await cabinLayoutService.fetchSeatMap(manifest.cabinLayout).catch(() => null);

        if (!cancelled) {
          setState({ status: "ready", manifest, seatMap });
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setState({ status: "unavailable", gap: gapOf(reason, flightStatus) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [flightService, cabinLayoutService, flightId, flightStatus, serviceType]);

  return state;
}
