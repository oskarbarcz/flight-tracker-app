import { useFlightState } from "~/state/contexts/flight.state";
import { flightService } from "~/state/services/flight.service";

export const useTrackedFlight = () => {
  const { state, dispatch } = useFlightState();

  const loadTrackedFlight = (flightNumber: string) => {
    dispatch({ type: "SET_LOADING", payload: true });

    const trackedFlight = flightService.fetchTrackedFlightById(flightNumber);
    dispatch({ type: "SET_TRACKED_FLIGHT_DETAILS", payload: trackedFlight });
    dispatch({ type: "SET_LOADING", payload: false });
  };

  return { ...state, loadTrackedFlight };
};
