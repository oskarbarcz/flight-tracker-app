import { useEffect, useState } from "react";
import type { CabinSeatMap } from "~/features/cabin-layout/model";
import { type Flight, type FlightManifest, FlightServiceType, type PassengerStatus } from "~/features/flight";
import { useApi } from "~/shared/api/useApi";

export type ManifestGap = "cargo" | "no-layout" | "no-loadsheet" | "forbidden" | "failed";

export type FlightCabin =
  | { status: "loading" }
  | { status: "unavailable"; gap: ManifestGap }
  | { status: "ready"; flightId: string; manifest: FlightManifest; seatMap: CabinSeatMap | null };

const FORBIDDEN = 403;
const NOT_FOUND = 404;

function gapOfFailure(statusCode: number | undefined): ManifestGap {
  if (statusCode === FORBIDDEN) {
    return "forbidden";
  }
  return statusCode === NOT_FOUND ? "no-loadsheet" : "failed";
}

function gapOf(flight: Flight): ManifestGap | null {
  if (flight.serviceType === FlightServiceType.Cargo) {
    return "cargo";
  }
  if (flight.aircraft.cabinLayout === null) {
    return "no-layout";
  }
  return null;
}

export function useFlightCabin(flight: Flight | null, status?: PassengerStatus): FlightCabin {
  const { flightService, cabinLayoutService } = useApi();
  const [state, setState] = useState<FlightCabin>({ status: "loading" });

  const flightId = flight?.id ?? null;
  const gap = flight === null ? null : gapOf(flight);

  useEffect(() => {
    if (flightId === null) {
      return;
    }

    if (gap !== null) {
      setState({ status: "unavailable", gap });
      return;
    }

    let cancelled = false;
    setState((current) =>
      current.status === "ready" && current.flightId === flightId ? current : { status: "loading" },
    );

    flightService
      .fetchManifestByFlightId(flightId, status)
      .then(async (manifest) => {
        const seatMap = await cabinLayoutService.fetchSeatMap(manifest.cabinLayout).catch(() => null);

        if (!cancelled) {
          setState({ status: "ready", flightId, manifest, seatMap });
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setState({ status: "unavailable", gap: gapOfFailure((reason as { statusCode?: number }).statusCode) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [flightService, cabinLayoutService, flightId, gap, status]);

  return state;
}
