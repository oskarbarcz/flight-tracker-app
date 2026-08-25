import { useEffect, useState } from "react";
import type { AircraftHoldLayout, HoldVariant } from "~/features/cargo-hold/model";
import { variantById } from "~/features/cargo-hold/model";
import type { FlightCargoManifest } from "~/features/cargo-manifest/model";
import { type Flight, FlightStatus } from "~/features/flight";
import { useApi } from "~/shared/api/useApi";

export type CargoGap = "not-released" | "no-cargo" | "forbidden" | "failed";

export type FlightCargo =
  | { status: "loading" }
  | { status: "unavailable"; gap: CargoGap }
  | {
      status: "ready";
      manifest: FlightCargoManifest;
      layout: AircraftHoldLayout | null;
      variant: HoldVariant | null;
    };

const FORBIDDEN = 403;
const NOT_FOUND = 404;

function statusCodeOf(reason: unknown): number | undefined {
  return (reason as { statusCode?: number }).statusCode;
}

function gapOfFailure(statusCode: number | undefined): CargoGap {
  if (statusCode === FORBIDDEN) {
    return "forbidden";
  }
  return statusCode === NOT_FOUND ? "no-cargo" : "failed";
}

export function useFlightCargo(flight: Flight | null): FlightCargo {
  const { cargoManifestService, cargoHoldService } = useApi();
  const [state, setState] = useState<FlightCargo>({ status: "loading" });

  const flightId = flight?.id ?? null;
  const airframeType = flight?.aircraft.airframe.type ?? null;
  const isReleased = flight !== null && flight.status !== FlightStatus.Created;

  useEffect(() => {
    if (flightId === null || airframeType === null) {
      return;
    }

    if (!isReleased) {
      setState({ status: "unavailable", gap: "not-released" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    cargoManifestService
      .fetchByFlightId(flightId)
      .then(async (manifest) => {
        const layout =
          manifest.holdVariant === null ? null : await cargoHoldService.fetchByType(airframeType).catch(() => null);
        const variant =
          layout === null || manifest.holdVariant === null ? null : variantById(layout, manifest.holdVariant);

        if (!cancelled) {
          setState({ status: "ready", manifest, layout, variant });
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setState({ status: "unavailable", gap: gapOfFailure(statusCodeOf(reason)) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cargoManifestService, cargoHoldService, flightId, airframeType, isReleased]);

  return state;
}
