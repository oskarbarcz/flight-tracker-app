import { useFlightState } from "~/state/contexts/flight.state";
import { Flight } from "~/models";
import { useFlightService } from "~/state/hooks/api/useFlightService";

export const useFlight = () => {
  const flightService = useFlightService();
  const { state, dispatch } = useFlightState();

  const loadFlight = async (flightId: string): Promise<Flight> => {
    dispatch({ type: "SET_LOADING", payload: true });

    const trackedFlight = await flightService.fetchFlightById(flightId);
    dispatch({ type: "SET_TRACKED_FLIGHT_DETAILS", payload: trackedFlight });
    dispatch({ type: "SET_LOADING", payload: false });

    return trackedFlight;
  };

  const startBoarding = async (flightId: string) => {
    await flightService.startBoarding(flightId);
    await loadFlight(flightId);
  };

  const finishBoarding = async (flightId: string) => {
    await flightService.finishBoarding(flightId);
    await loadFlight(flightId);
  };

  const reportOffBlock = async (flightId: string) => {
    await flightService.reportOffBlock(flightId);
    await loadFlight(flightId);
  };

  const reportTakeoff = async (flightId: string) => {
    await flightService.reportTakeoff(flightId);
    await loadFlight(flightId);
  };

  const reportArrival = async (flightId: string) => {
    await flightService.reportArrival(flightId);
    await loadFlight(flightId);
  };

  const reportOnBlock = async (flightId: string) => {
    await flightService.reportOnBlock(flightId);
    await loadFlight(flightId);
  };

  const startOffboarding = async (flightId: string) => {
    await flightService.startOffboarding(flightId);
    await loadFlight(flightId);
  };

  const finishOffboarding = async (flightId: string) => {
    await flightService.finishOffboarding(flightId);
    await loadFlight(flightId);
  };

  const close = async (flightId: string) => {
    await flightService.close(flightId);
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
