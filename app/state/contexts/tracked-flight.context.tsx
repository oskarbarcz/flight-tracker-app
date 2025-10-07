import { Flight, FilledSchedule, Loadsheet, FlightEvent } from "~/models";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useApi } from "~/state/contexts/api.context";

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

const TrackedFlightContext = createContext<TrackedFlightContextType>({
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

export const TrackedFlightProvider = ({
  children,
}: FlightStateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { flightService } = useApi();

  const setFlightId = useCallback((flightId: string) => {
    dispatch({ type: "SET_FLIGHT_ID", payload: flightId });
  }, []);

  const loadFlight = useCallback(async () => {
    if (!state.flightId) return;
    dispatch({ type: "SET_LOADING", payload: true });
    const updatedFlight = await flightService.getById(state.flightId);
    const events = await flightService.getEventsByFlightId(state.flightId);
    dispatch({ type: "SET_TRACKED_FLIGHT", payload: updatedFlight });
    dispatch({ type: "SET_TRACKED_FLIGHT_EVENTS", payload: events });
    dispatch({ type: "SET_LOADING", payload: false });
  }, [flightService, state.flightId]);

  useEffect(() => {
    if (state.flightId) {
      loadFlight();
    }
  }, [loadFlight, state.flightId]);

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
    <TrackedFlightContext.Provider
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
    </TrackedFlightContext.Provider>
  );
};

export const useTrackedFlight = () => {
  const ctx = useContext(TrackedFlightContext);
  if (!ctx)
    throw new Error(
      "useTrackedFlight must be used within a TrackedFlightProvider",
    );
  return ctx;
};
