import { useCallback, useEffect, useRef, useState } from "react";
import type { Airport } from "~/features/airport";
import type { ChangeRequestDetail } from "~/features/change-request/model";
import { isNotFound } from "~/shared/api/api.service";
import { useApi } from "~/shared/api/useApi";

export type ChangeRequestReviewState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "failed" }
  | { status: "ready"; detail: ChangeRequestDetail; airport: Airport | null };

export type ChangeRequestReview = {
  state: ChangeRequestReviewState;
  reload: () => Promise<void>;
  showDetail: (detail: ChangeRequestDetail) => void;
};

export function useChangeRequestReview(requestId: string): ChangeRequestReview {
  const { changeRequestService, airportService } = useApi();
  const [state, setState] = useState<ChangeRequestReviewState>({ status: "loading" });
  const latestRequestId = useRef(requestId);
  const airports = useRef(new Map<string, Promise<Airport | null>>());

  const airportFor = useCallback(
    (detail: ChangeRequestDetail): Promise<Airport | null> => {
      if (detail.target === null) {
        return Promise.resolve(null);
      }
      const airportId = detail.target.airport.id;
      const cached = airports.current.get(airportId);
      if (cached) {
        return cached;
      }
      const pending = airportService.fetchById(airportId).catch((error) => {
        console.error("Failed to load airport for data change review", error);
        airports.current.delete(airportId);
        return null;
      });
      airports.current.set(airportId, pending);
      return pending;
    },
    [airportService],
  );

  const load = useCallback(
    async (id: string) => {
      latestRequestId.current = id;
      setState({ status: "loading" });
      try {
        const detail = await changeRequestService.fetchById(id);
        const airport = await airportFor(detail);
        if (latestRequestId.current === id) {
          setState({ status: "ready", detail, airport });
        }
      } catch (error) {
        if (latestRequestId.current === id) {
          setState(isNotFound(error) ? { status: "missing" } : { status: "failed" });
        }
      }
    },
    [changeRequestService, airportFor],
  );

  useEffect(() => {
    load(requestId);
  }, [load, requestId]);

  const reload = useCallback(() => load(latestRequestId.current), [load]);

  const showDetail = useCallback((detail: ChangeRequestDetail) => {
    if (detail.target) {
      airports.current.delete(detail.target.airport.id);
    }
    setState((current) =>
      current.status === "ready" && current.detail.id === detail.id ? { ...current, detail } : current,
    );
  }, []);

  return { state, reload, showDetail };
}
