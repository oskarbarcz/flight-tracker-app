import { useFlightState } from "~/state/contexts/flight.state";
import { FlightService } from "~/state/services/flight.service";

export const useTrackedFlight = () => {
  const { state, dispatch } = useFlightState();

  const loadTrackedFlight = async (flightId: string) => {
    dispatch({type: "SET_LOADING", payload: true});

    const trackedFlight = await FlightService.fetchFlightById(flightId);
    dispatch({type: "SET_TRACKED_FLIGHT_DETAILS", payload: trackedFlight});
    dispatch({type: "SET_LOADING", payload: false});
  };

  return { ...state, loadTrackedFlight };
};
