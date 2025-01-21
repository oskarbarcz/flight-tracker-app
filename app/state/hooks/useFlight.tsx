import { useFlightState } from "~/state/contexts/flight.state";
import { FlightService } from "~/state/services/flight.service";
import { Flight } from "~/models";

export const useFlight = () => {
  const { state, dispatch } = useFlightState();

  const loadFlight = async (flightId: string): Promise<Flight> => {
    dispatch({ type: "SET_LOADING", payload: true });

    const trackedFlight = await FlightService.fetchFlightById(flightId);
    dispatch({ type: "SET_TRACKED_FLIGHT_DETAILS", payload: trackedFlight });
    dispatch({ type: "SET_LOADING", payload: false });

    return trackedFlight;
  };

  const startBoarding = async (flightId: string) => {
    await FlightService.startBoarding(flightId);
    await loadFlight(flightId);
  };

  const finishBoarding = async (flightId: string) => {
    await FlightService.finishBoarding(flightId);
    await loadFlight(flightId);
  };

  const reportOffBlock = async (flightId: string) => {
    await FlightService.reportOffBlock(flightId);
    await loadFlight(flightId);
  };

  const reportTakeoff = async (flightId: string) => {
    await FlightService.reportTakeoff(flightId);
    await loadFlight(flightId);
  };

  const reportArrival = async (flightId: string) => {
    await FlightService.reportArrival(flightId);
    await loadFlight(flightId);
  };

  const reportOnBlock = async (flightId: string) => {
    await FlightService.reportOnBlock(flightId);
    await loadFlight(flightId);
  };

  const startOffboarding = async (flightId: string) => {
    await FlightService.startOffboarding(flightId);
    await loadFlight(flightId);
  };

  const finishOffboarding = async (flightId: string) => {
    await FlightService.finishOffboarding(flightId);
    await loadFlight(flightId);
  };

  const close = async (flightId: string) => {
    await FlightService.close(flightId);
    await loadFlight(flightId);
  };

  return {
    ...state,
    loadFlight,
    startBoarding,
    finishBoarding,
    reportOffBlock,
    reportTakeoff,
    reportArrival,
    reportOnBlock,
    startOffboarding,
    finishOffboarding,
    close,
  };
};
