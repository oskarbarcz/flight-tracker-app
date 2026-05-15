import React, { createContext, type ReactNode, useCallback, useContext, useEffect, useReducer, useRef } from "react";
import type { FilledSchedule, Flight, FlightEvent, Loadsheet } from "~/models";
import { useApi } from "~/state/api/context/useApi";
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
  loading: boolean;
};

const initialState: State = {
  flightId: null,
  flight: null,
  events: [],
  loading: false,
};

type Action =
  | { type: "SET_TRACKED_FLIGHT"; payload: Flight }
  | { type: "SET_TRACKED_FLIGHT_EVENTS"; payload: FlightEvent[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_FLIGHT_ID"; payload: string | null };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TRACKED_FLIGHT":
      return { ...state, flight: action.payload };
    case "SET_TRACKED_FLIGHT_EVENTS":
      return { ...state, events: action.payload };
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
  loading: boolean;
  setFlightId: (flightId: string) => void;
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
};

const UseTrackedFlight = createContext<TrackedFlightContextType>({
  flight: null,
  events: [],
  loading: false,
  setFlightId: () => {},
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
});

type FlightStateProviderProps = {
  children: ReactNode;
};

export const TrackedFlightProvider = ({ children }: FlightStateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { flightService } = useApi();
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
      dispatch({ type: "SET_TRACKED_FLIGHT", payload: updatedFlight });
      dispatch({ type: "SET_TRACKED_FLIGHT_EVENTS", payload: events });
      markRefreshed();
      if (!silent) dispatch({ type: "SET_LOADING", payload: false });
    },
    [flightService, state.flightId, markRefreshed],
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
   * the flight hasn't changed either. If it has, update events and pull the
   * fresh flight.
   */
  const pollEvents = useCallback(async () => {
    if (!state.flightId) return;
    const fresh = await flightService.fetchEventsByFlightId(state.flightId);
    markRefreshed();
    if (!eventsListChanged(fresh, eventsRef.current)) return;

    dispatch({ type: "SET_TRACKED_FLIGHT_EVENTS", payload: fresh });
    const updatedFlight = await flightService.fetchById(state.flightId);
    dispatch({ type: "SET_TRACKED_FLIGHT", payload: updatedFlight });
  }, [flightService, state.flightId, markRefreshed]);

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

  return (
    <UseTrackedFlight.Provider
      value={{
        flight: state.flight,
        events: state.events,
        loading: state.loading,
        setFlightId,
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
