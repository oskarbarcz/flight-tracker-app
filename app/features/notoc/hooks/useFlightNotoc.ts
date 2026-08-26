import { useEffect, useState } from "react";
import type { Flight } from "~/features/flight/model";
import { type FlightNotoc, NotocStage } from "~/features/notoc/model";
import { useApi } from "~/shared/api/useApi";

export type NotocGap = "not-issued" | "forbidden" | "failed";

export type FlightNotocState =
  | { status: "loading" }
  | { status: "unavailable"; gap: NotocGap }
  | { status: "ready"; flightId: string; notoc: FlightNotoc; issuedStages: NotocStage[] };

const FORBIDDEN = 403;
const NOT_FOUND = 404;

function gapOfFailure(statusCode: number | undefined): NotocGap {
  if (statusCode === FORBIDDEN) {
    return "forbidden";
  }
  return statusCode === NOT_FOUND ? "not-issued" : "failed";
}

function issuedStagesFrom(latest: NotocStage): NotocStage[] {
  return latest === NotocStage.Final ? [NotocStage.Preliminary, NotocStage.Final] : [NotocStage.Preliminary];
}

export function useFlightNotoc(flight: Flight | null, stage?: NotocStage): FlightNotocState {
  const { notocService } = useApi();
  const [state, setState] = useState<FlightNotocState>({ status: "loading" });

  const flightId = flight?.id ?? null;

  useEffect(() => {
    if (flightId === null) {
      return;
    }

    let cancelled = false;
    setState((current) =>
      current.status === "ready" && current.flightId === flightId ? current : { status: "loading" },
    );

    notocService
      .fetchByFlightId(flightId, stage)
      .then((notoc) => {
        if (cancelled) {
          return;
        }

        setState((current) => ({
          status: "ready",
          flightId,
          notoc,
          issuedStages:
            current.status === "ready" && current.flightId === flightId
              ? mergeStages(current.issuedStages, notoc.stage)
              : issuedStagesFrom(notoc.stage),
        }));
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setState({ status: "unavailable", gap: gapOfFailure((reason as { statusCode?: number }).statusCode) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [notocService, flightId, stage]);

  return state;
}

function mergeStages(known: NotocStage[], seen: NotocStage): NotocStage[] {
  return known.includes(seen) ? known : [...known, seen];
}
