import { FlightService } from "~/state/services/flight.service";

const flightService = new FlightService();

export function useFlightService(): FlightService {
  return flightService;
}
