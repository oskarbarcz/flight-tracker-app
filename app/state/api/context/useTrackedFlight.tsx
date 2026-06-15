import React, { createContext, type ReactNode, useCallback, useContext, useEffect, useReducer } from "react";
import {
  type DelayRequest,
  type Diversion,
  type Emergency,
  type FilledSchedule,
  type Flight,
  type FlightEvent,
  isEmergencyEvent,
  type Loadsheet,
} from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { subscribeToFlightEvents } from "~/state/api/flightEvents.socket";
import type { RejectDelayReportRequest, ReportDelayRequest } from "~/state/api/request/delay.request";
import type { ReportDiversionRequest, UpdateDiversionRequest } from "~/state/api/request/diversion.request";
import type { DeclareEmergencyRequest, UpdateEmergencyRequest } from "~/state/api/request/emergency.request";
import { useDataRefresh } from "~/state/app/context/useDataRefresh";

function sortNewestFirst(events: FlightEvent[]): FlightEvent[] {
  return [...events].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

type State = {
  flightId: string | null;
  events: FlightEvent[];
  flight: Flight | null;
  emergencies: Emergency[];
  diversion: Diversion | null;
  delayRequest: DelayRequest | null;
  loading: boolean;
};

const initialState: State = {
  flightId: null,
  flight: null,
  events: [],
  emergencies: [],
  diversion: null,
  delayRequest: null,
  loading: false,
};

type Action =
  | { type: "SET_TRACKED_FLIGHT"; payload: Flight }
  | { type: "SET_TRACKED_FLIGHT_EVENTS"; payload: FlightEvent[] }
  | { type: "PREPEND_TRACKED_FLIGHT_EVENT"; payload: FlightEvent }
  | { type: "SET_TRACKED_FLIGHT_EMERGENCIES"; payload: Emergency[] }
  | { type: "SET_TRACKED_FLIGHT_DIVERSION"; payload: Diversion | null }
  | { type: "SET_TRACKED_FLIGHT_DELAY"; payload: DelayRequest | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_FLIGHT_ID"; payload: string | null };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TRACKED_FLIGHT":
      return { ...state, flight: action.payload };
    case "SET_TRACKED_FLIGHT_EVENTS":
      return { ...state, events: action.payload };
    case "PREPEND_TRACKED_FLIGHT_EVENT":
      if (state.events.some((event) => event.id === action.payload.id)) return state;
      return { ...state, events: [action.payload, ...state.events] };
    case "SET_TRACKED_FLIGHT_EMERGENCIES":
      return { ...state, emergencies: action.payload };
    case "SET_TRACKED_FLIGHT_DIVERSION":
      return { ...state, diversion: action.payload };
    case "SET_TRACKED_FLIGHT_DELAY":
      return { ...state, delayRequest: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_FLIGHT_ID":
      return { ...state, flightId: action.payload };
    default:
      return state;
  }
};

type TrackedFlightContextType = {
  flight: Flight | null;
  events: FlightEvent[];
  emergencies: Emergency[];
  activeEmergency: Emergency | null;
  diversion: Diversion | null;
  delayRequest: DelayRequest | null;
  loading: boolean;
  setFlightId: (flightId: string) => void;
  reload: () => Promise<void>;
  checkIn: (schedule: FilledSchedule) => Promise<void>;
  startBoarding: () => Promise<void>;
  finishBoarding: (loadsheet: Loadsheet) => Promise<void>;
  reportOffBlock: () => Promise<void>;
  reportTakeoff: () => Promise<void>;
  reportArrival: () => Promise<void>;
  reportOnBlock: () => Promise<void>;
  startOffboarding: () => Promise<void>;
  finishOffboarding: () => Promise<void>;
  close: () => Promise<void>;
  declareEmergency: (body: DeclareEmergencyRequest) => Promise<void>;
  updateEmergency: (emergencyId: string, body: UpdateEmergencyRequest) => Promise<void>;
  resolveEmergency: (emergencyId: string) => Promise<void>;
  reportDiversion: (body: ReportDiversionRequest) => Promise<void>;
  updateDiversion: (body: UpdateDiversionRequest) => Promise<void>;
  fileDelayReport: (body: ReportDelayRequest) => Promise<void>;
  removeDelayReport: (reportId: string) => Promise<void>;
  acceptDelayReport: (reportId: string) => Promise<void>;
  rejectDelayReport: (reportId: string, body: RejectDelayReportRequest) => Promise<void>;
};

const UseTrackedFlight = createContext<TrackedFlightContextType>({
  flight: null,
  events: [],
  emergencies: [],
  activeEmergency: null,
  diversion: null,
  delayRequest: null,
  loading: false,
  setFlightId: () => {},
  reload: async () => {},
  checkIn: async () => {},
  startBoarding: async () => {},
  finishBoarding: async () => {},
  reportOffBlock: async () => {},
  reportTakeoff: async () => {},
  reportArrival: async () => {},
  reportOnBlock: async () => {},
  startOffboarding: async () => {},
  finishOffboarding: async () => {},
  close: async () => {},
  declareEmergency: async () => {},
  updateEmergency: async () => {},
  resolveEmergency: async () => {},
  reportDiversion: async () => {},
  updateDiversion: async () => {},
  fileDelayReport: async () => {},
  removeDelayReport: async () => {},
  acceptDelayReport: async () => {},
  rejectDelayReport: async () => {},
});

type FlightStateProviderProps = {
  children: ReactNode;
};

export const TrackedFlightProvider = ({ children }: FlightStateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { flightService, emergencyService, diversionService, delayService } = useApi();
  const { markRefreshed } = useDataRefresh();

  const setFlightId = useCallback((flightId: string) => {
    dispatch({ type: "SET_FLIGHT_ID", payload: flightId });
  }, []);

  const loadFlight = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (!state.flightId) return;
      if (!silent) dispatch({ type: "SET_LOADING", payload: true });
      const updatedFlight = await flightService.fetchById(state.flightId);
      const diversion = updatedFlight.isFlightDiverted ? await diversionService.getByFlight(state.flightId) : null;
      const delayRequest = await delayService.getByFlight(state.flightId);
      dispatch({ type: "SET_TRACKED_FLIGHT", payload: updatedFlight });
      dispatch({ type: "SET_TRACKED_FLIGHT_DIVERSION", payload: diversion });
      dispatch({ type: "SET_TRACKED_FLIGHT_DELAY", payload: delayRequest });
      markRefreshed();
      if (!silent) dispatch({ type: "SET_LOADING", payload: false });
    },
    [flightService, diversionService, delayService, state.flightId, markRefreshed],
  );

  useEffect(() => {
    if (!state.flightId) return;
    loadFlight();
    return subscribeToFlightEvents(state.flightId, {
      onHistory: (events) => {
        dispatch({ type: "SET_TRACKED_FLIGHT_EVENTS", payload: sortNewestFirst(events) });
        markRefreshed();
      },
      onEvent: (event) => {
        dispatch({ type: "PREPEND_TRACKED_FLIGHT_EVENT", payload: event });
        markRefreshed();
        loadFlight({ silent: true });
      },
      onError: (error) => console.error("Flight events subscription failed", error),
    });
  }, [loadFlight, state.flightId, markRefreshed]);

  const emergencyEventIds = state.events
    .filter((event) => isEmergencyEvent(event.type))
    .map((event) => event.id)
    .join(",");
  const hasActiveEmergency = state.flight?.hasActiveEmergency ?? false;

  useEffect(() => {
    if (!state.flightId) return;
    if (!hasActiveEmergency && emergencyEventIds.length === 0) {
      dispatch({ type: "SET_TRACKED_FLIGHT_EMERGENCIES", payload: [] });
      return;
    }
    emergencyService
      .listByFlight(state.flightId)
      .then((emergencies) => dispatch({ type: "SET_TRACKED_FLIGHT_EMERGENCIES", payload: emergencies }))
      .catch((error) => console.error("Failed to load flight emergencies", error));
  }, [state.flightId, hasActiveEmergency, emergencyEventIds, emergencyService]);

  // All domain actions now in context
  const checkIn = useCallback(
    async (schedule: FilledSchedule) => {
      if (!state.flightId) return;
      await flightService.checkIn(state.flightId, schedule);
      await loadFlight();
    },
    [flightService, state.flightId, loadFlight],
  );

  const startBoarding = useCallback(async () => {
    if (!state.flightId) return;
    await flightService.startBoarding(state.flightId);
    await loadFlight();
  }, [flightService, state.flightId, loadFlight]);

  const finishBoarding = useCallback(
    async (loadsheet: Loadsheet) => {
      if (!state.flightId) return;
      await flightService.finishBoarding(state.flightId, loadsheet);
      await loadFlight();
    },
    [flightService, state.flightId, loadFlight],
  );

  const reportOffBlock = useCallback(async () => {
    if (!state.flightId) return;
    await flightService.reportOffBlock(state.flightId);
    await loadFlight();
  }, [flightService, state.flightId, loadFlight]);

  const reportTakeoff = useCallback(async () => {
    if (!state.flightId) return;
    await flightService.reportTakeoff(state.flightId);
    await loadFlight();
  }, [flightService, state.flightId, loadFlight]);

  const reportArrival = useCallback(async () => {
    if (!state.flightId) return;
    await flightService.reportArrival(state.flightId);
    await loadFlight();
  }, [flightService, state.flightId, loadFlight]);

  const reportOnBlock = useCallback(async () => {
    if (!state.flightId) return;
    await flightService.reportOnBlock(state.flightId);
    await loadFlight();
  }, [flightService, state.flightId, loadFlight]);

  const startOffboarding = useCallback(async () => {
    if (!state.flightId) return;
    await flightService.startOffboarding(state.flightId);
    await loadFlight();
  }, [flightService, state.flightId, loadFlight]);

  const finishOffboarding = useCallback(async () => {
    if (!state.flightId) return;
    await flightService.finishOffboarding(state.flightId);
    await loadFlight();
  }, [flightService, state.flightId, loadFlight]);

  const close = useCallback(async () => {
    if (!state.flightId) return;
    await flightService.close(state.flightId);
    await loadFlight();
  }, [flightService, state.flightId, loadFlight]);

  const declareEmergency = useCallback(
    async (body: DeclareEmergencyRequest) => {
      if (!state.flightId) return;
      await emergencyService.declare(state.flightId, body);
      await loadFlight({ silent: true });
    },
    [emergencyService, state.flightId, loadFlight],
  );

  const updateEmergency = useCallback(
    async (emergencyId: string, body: UpdateEmergencyRequest) => {
      if (!state.flightId) return;
      await emergencyService.update(state.flightId, emergencyId, body);
      await loadFlight({ silent: true });
    },
    [emergencyService, state.flightId, loadFlight],
  );

  const resolveEmergency = useCallback(
    async (emergencyId: string) => {
      if (!state.flightId) return;
      await emergencyService.resolve(state.flightId, emergencyId);
      await loadFlight({ silent: true });
    },
    [emergencyService, state.flightId, loadFlight],
  );

  const reportDiversion = useCallback(
    async (body: ReportDiversionRequest) => {
      if (!state.flightId) return;
      await diversionService.report(state.flightId, body);
      await loadFlight({ silent: true });
    },
    [diversionService, state.flightId, loadFlight],
  );

  const updateDiversion = useCallback(
    async (body: UpdateDiversionRequest) => {
      if (!state.flightId) return;
      await diversionService.update(state.flightId, body);
      await loadFlight({ silent: true });
    },
    [diversionService, state.flightId, loadFlight],
  );

  const fileDelayReport = useCallback(
    async (body: ReportDelayRequest) => {
      if (!state.flightId) return;
      await delayService.fileReport(state.flightId, body);
      await loadFlight({ silent: true });
    },
    [delayService, state.flightId, loadFlight],
  );

  const removeDelayReport = useCallback(
    async (reportId: string) => {
      if (!state.flightId) return;
      await delayService.removeReport(state.flightId, reportId);
      await loadFlight({ silent: true });
    },
    [delayService, state.flightId, loadFlight],
  );

  const acceptDelayReport = useCallback(
    async (reportId: string) => {
      if (!state.flightId) return;
      await delayService.acceptReport(state.flightId, reportId);
      await loadFlight({ silent: true });
    },
    [delayService, state.flightId, loadFlight],
  );

  const rejectDelayReport = useCallback(
    async (reportId: string, body: RejectDelayReportRequest) => {
      if (!state.flightId) return;
      await delayService.rejectReport(state.flightId, reportId, body);
      await loadFlight({ silent: true });
    },
    [delayService, state.flightId, loadFlight],
  );

  const activeEmergency = state.emergencies.find((e) => e.isActive) ?? null;

  return (
    <UseTrackedFlight.Provider
      value={{
        flight: state.flight,
        events: state.events,
        emergencies: state.emergencies,
        activeEmergency,
        diversion: state.diversion,
        delayRequest: state.delayRequest,
        loading: state.loading,
        setFlightId,
        reload: () => loadFlight({ silent: true }),
        checkIn,
        startBoarding,
        finishBoarding,
        reportOffBlock,
        reportTakeoff,
        reportArrival,
        reportOnBlock,
        startOffboarding,
        finishOffboarding,
        close,
        declareEmergency,
        updateEmergency,
        resolveEmergency,
        reportDiversion,
        updateDiversion,
        fileDelayReport,
        removeDelayReport,
        acceptDelayReport,
        rejectDelayReport,
      }}
    >
      {children}
    </UseTrackedFlight.Provider>
  );
};

export const useTrackedFlight = () => {
  const ctx = useContext(UseTrackedFlight);
  if (!ctx) throw new Error("useTrackedFlight must be used within a TrackedFlightProvider");
  return ctx;
};
