import { AirportService } from "~/state/api/airport.service";

const instance = new AirportService();

export function useAirportService(): AirportService {
  return instance;
}
