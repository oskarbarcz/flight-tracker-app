import {Flight} from "~/models";
import {createContext, ReactNode, useContext, useReducer} from "react";

type State = {
  trackedFlight: Flight | null;
  loading: boolean;
}

const initialState: State = {
  trackedFlight: null,
  loading: false
};

type Action =
  | { type: 'SET_TRACKED_FLIGHT_DETAILS'; payload: Flight }
  | { type: 'SET_LOADING'; payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TRACKED_FLIGHT_DETAILS':
      return { ...state, trackedFlight: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const FlightStateContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

type FlightStateProviderProps = {
  children: ReactNode
};

export const FlightStateProvider = ({ children }: FlightStateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <FlightStateContext.Provider value={{ state, dispatch }}>
      {children}
    </FlightStateContext.Provider>
  );
};

export const useFlightState = () => useContext(FlightStateContext);