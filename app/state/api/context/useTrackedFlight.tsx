import React, { createContext, type ReactNode, useCallback, useContext, useEffect, useReducer, useRef } from "react";
import type { Diversion, Emergency, FilledSchedule, Flight, FlightEvent, Loadsheet } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import type { ReportDiversionRequest, UpdateDiversionRequest } from "~/state/api/request/diversion.request";
import type { DeclareEmergencyRequest, UpdateEmergencyRequest } from "~/state/api/request/emergency.request";
import { useDataRefresh } from "~/state/app/context/useDataRefresh";

const TRACKED_FLIGHT_REFRESH_INTERVAL_MS = 10_000;

function eventsListChanged(a: FlightEvent[], b: FlightEvent[]): boolean {
  if (a.length !== b.length) return true;
  if (a.length === 0) return false;
  return a[0].id !== b[0].id;
}

type State = {
  flightId: string | null;
  events: FlightEvent[];
  flight: Flight | null;
  emergencies: Emergency[];
  diversion: Diversion | null;
  loading: boolean;
};

const initialState: State = {
  flightId: null,
  flight: null,
  events: [],
  emergencies: [],
  diversion: null,
  loading: false,
};

type Action =
  | { type: "SET_TRACKED_FLIGHT"; payload: Flight }
  | { type: "SET_TRACKED_FLIGHT_EVENTS"; payload: FlightEvent[] }
  | { type: "SET_TRACKED_FLIGHT_EMERGENCIES"; payload: Emergency[] }
  | { type: "SET_TRACKED_FLIGHT_DIVERSION"; payload: Diversion | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_FLIGHT_ID"; payload: string | null };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TRACKED_FLIGHT":
      return { ...state, flight: action.payload };
    case "SET_TRACKED_FLIGHT_EVENTS":
      return { ...state, events: action.payload };
    case "SET_TRACKED_FLIGHT_EMERGENCIES":
      return { ...state, emergencies: action.payload };
    case "SET_TRACKED_FLIGHT_DIVERSION":
      return { ...state, diversion: action.payload };
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
};

const UseTrackedFlight = createContext<TrackedFlightContextType>({
  flight: null,
  events: [],
  emergencies: [],
  activeEmergency: null,
  diversion: null,
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
});

type FlightStateProviderProps = {
  children: ReactNode;
};

export const TrackedFlightProvider = ({ children }: FlightStateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { flightService, emergencyService, diversionService } = useApi();
  const { markRefreshed } = useDataRefresh();

  const setFlightId = useCallback((flightId: string) => {
    dispatch({ type: "SET_FLIGHT_ID", payload: flightId });
  }, []);

  const loadFlight = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (!state.flightId) return;
      if (!silent) dispatch({ type: "SET_LOADING", payload: true });
      const updatedFlight = await flightService.fetchById(state.flightId);
      const events = await flightService.fetchEventsByFlightId(state.flightId);
      const emergencies = await emergencyService.listByFlight(state.flightId);
      const diversion = updatedFlight.isFlightDiverted ? await diversionService.getByFlight(state.flightId) : null;
      dispatch({ type: "SET_TRACKED_FLIGHT", payload: updatedFlight });
      dispatch({ type: "SET_TRACKED_FLIGHT_EVENTS", payload: events });
      dispatch({ type: "SET_TRACKED_FLIGHT_EMERGENCIES", payload: emergencies });
      dispatch({ type: "SET_TRACKED_FLIGHT_DIVERSION", payload: diversion });
      markRefreshed();
      if (!silent) dispatch({ type: "SET_LOADING", payload: false });
    },
    [flightService, emergencyService, diversionService, state.flightId, markRefreshed],
  );

  // Keep a stable reference to the latest events so pollEvents doesn't need
  // them in its dependency list (which would restart the interval on every
  // events update).
  const eventsRef = useRef<FlightEvent[]>(state.events);
  useEffect(() => {
    eventsRef.current = state.events;
  }, [state.events]);

  /**
   * Cheap poll: fetch only events. If the list hasn't changed, do nothing —
   * neither the flight nor the emergencies have changed either, since every
   * emergency state change produces a flight event.
   */
  const pollEvents = useCallback(async () => {
    if (!state.flightId) return;
    const fresh = await flightService.fetchEventsByFlightId(state.flightId);
    markRefreshed();
    if (!eventsListChanged(fresh, eventsRef.current)) return;

    dispatch({ type: "SET_TRACKED_FLIGHT_EVENTS", payload: fresh });
    const [updatedFlight, emergencies] = await Promise.all([
      flightService.fetchById(state.flightId),
      emergencyService.listByFlight(state.flightId),
    ]);
    const diversion = updatedFlight.isFlightDiverted ? await diversionService.getByFlight(state.flightId) : null;
    dispatch({ type: "SET_TRACKED_FLIGHT", payload: updatedFlight });
    dispatch({ type: "SET_TRACKED_FLIGHT_EMERGENCIES", payload: emergencies });
    dispatch({ type: "SET_TRACKED_FLIGHT_DIVERSION", payload: diversion });
  }, [flightService, emergencyService, diversionService, state.flightId, markRefreshed]);

  useEffect(() => {
    if (!state.flightId) return;
    loadFlight();
    const interval = setInterval(pollEvents, TRACKED_FLIGHT_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadFlight, pollEvents, state.flightId]);

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

  const activeEmergency = state.emergencies.find((e) => e.isActive) ?? null;

  return (
    <UseTrackedFlight.Provider
      value={{
        flight: state.flight,
        events: state.events,
        emergencies: state.emergencies,
        activeEmergency,
        diversion: state.diversion,
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
