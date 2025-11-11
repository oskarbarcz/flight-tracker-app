import { PublicFlightService } from "~/state/api/flight.service";
import { AdsbService } from "~/state/api/adsb.service";

const services = {
  publicFlightService: new PublicFlightService(),
  adsbService: new AdsbService(),
};

export function usePublicApi() {
  return services;
}
