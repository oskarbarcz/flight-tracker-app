import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { FlightPathElement } from "~/models";
import { usePublicApi } from "~/state/contexts/content/public-api.context";

type State = {
  callsign: string | null;
  flightPath: FlightPathElement[];
  lastRequestedAt: Date | null;
  loading: boolean;
};

const initialState: State = {
  callsign: null,
  flightPath: [],
  lastRequestedAt: null,
  loading: false,
};

type Action =
  | { type: "SET_PATH_ELEMENTS"; payload: FlightPathElement[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CALLSIGN"; payload: string | null };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PATH_ELEMENTS":
      return {
        ...state,
        flightPath: action.payload,
        lastRequestedAt: new Date(),
      };
    case "SET_CALLSIGN":
      return { ...state, callsign: action.payload };
    default:
      return state;
  }
};

type AdsbContextType = State & {
  setCallsign(callsign: string): void;
  loadFlightPath: () => Promise<void>;
};

const AdsbContext = createContext<AdsbContextType>({
  callsign: null,
  flightPath: [],
  lastRequestedAt: null,
  setCallsign: () => {},
  loadFlightPath: async () => {},
  loading: false,
});

type AdsbProviderProps = {
  children: ReactNode;
};

export const AdsbProvider = ({ children }: AdsbProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { adsbService } = usePublicApi();

  const setCallsign = useCallback((callsign: string) => {
    dispatch({ type: "SET_CALLSIGN", payload: callsign });
  }, []);

  const loadFlightPath = useCallback(async () => {
    if (!state.callsign) return;
    dispatch({ type: "SET_LOADING", payload: true });
    const flightPath = await adsbService.getRecordsByCallsign(state.callsign);
    dispatch({ type: "SET_PATH_ELEMENTS", payload: flightPath });
    dispatch({ type: "SET_LOADING", payload: false });
  }, [adsbService, state.callsign]);

  useEffect(() => {
    if (state.callsign) {
      loadFlightPath();
    }
  }, [loadFlightPath, state.callsign]);

  return (
    <AdsbContext.Provider
      value={{
        callsign: state.callsign,
        flightPath: state.flightPath,
        lastRequestedAt: state.lastRequestedAt,
        loading: state.loading,
        setCallsign,
        loadFlightPath,
      }}
    >
      {children}
    </AdsbContext.Provider>
  );
};

export const useAdsbData = () => {
  const ctx = useContext(AdsbContext);
  if (!ctx) throw new Error("useAdsbApi must be used within a AdsbContext");
  return ctx;
};
