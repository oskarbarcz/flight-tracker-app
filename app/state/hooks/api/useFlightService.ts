import { FlightService } from "~/state/api/flight.service";

const flightService = new FlightService();

export function useFlightService(): FlightService {
  return flightService;
}
