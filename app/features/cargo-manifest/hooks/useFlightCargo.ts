import { useEffect, useState } from "react";
import type { HoldVariant } from "~/features/cargo-hold/model";
import { variantById } from "~/features/cargo-hold/model";
import type { FlightCargoManifest } from "~/features/cargo-manifest/model";
import type { Flight } from "~/features/flight";
import { useApi } from "~/shared/api/useApi";

export type CargoGap = "not-generated" | "no-cargo" | "forbidden" | "failed";

export const NO_CURATED_HOLD_DATA =
  "This airframe type carries no curated hold data, so no unit reports a position or a compartment.";
export const HOLD_CONFIGURATION_UNREADABLE =
  "The hold configuration for this airframe type could not be read, so positions and compartments are unavailable here.";

export type FlightCargo =
  | { status: "loading" }
  | { status: "unavailable"; gap: CargoGap }
  | {
      status: "ready";
      manifest: FlightCargoManifest;
      variant: HoldVariant | null;
      holdDataNote: string | null;
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
  return statusCode === NOT_FOUND ? "not-generated" : "failed";
}

function carriesNothing(manifest: FlightCargoManifest): boolean {
  return manifest.units.length === 0 && manifest.cargoKg === 0;
}

export function useFlightCargo(flight: Flight | null): FlightCargo {
  const { cargoManifestService, cargoHoldService } = useApi();
  const [state, setState] = useState<FlightCargo>({ status: "loading" });

  const flightId = flight?.id ?? null;
  const airframeType = flight?.aircraft.airframe.type ?? null;

  useEffect(() => {
    if (flightId === null || airframeType === null) {
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    cargoManifestService
      .fetchByFlightId(flightId)
      .then(async (manifest) => {
        if (carriesNothing(manifest)) {
          if (!cancelled) {
            setState({ status: "unavailable", gap: "no-cargo" });
          }
          return;
        }

        if (manifest.holdVariant === null) {
          if (!cancelled) {
            setState({ status: "ready", manifest, variant: null, holdDataNote: NO_CURATED_HOLD_DATA });
          }
          return;
        }

        const layout = await cargoHoldService.fetchByType(airframeType).catch(() => null);
        const variant = layout === null ? null : variantById(layout, manifest.holdVariant);

        if (!cancelled) {
          setState({
            status: "ready",
            manifest,
            variant,
            holdDataNote: variant === null ? HOLD_CONFIGURATION_UNREADABLE : null,
          });
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
  }, [cargoManifestService, cargoHoldService, flightId, airframeType]);

  return state;
}
