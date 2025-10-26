import { PublicFlightService } from "~/state/api/flight.service";

const services = {
  publicFlightService: new PublicFlightService(),
};

export function usePublicApi() {
  return services;
}
