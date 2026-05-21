import { AdsbService } from "~/state/api/adsb.service";
import { PublicFlightService } from "~/state/api/flight.service";
import { PublicRunwayService } from "~/state/api/runway.service";

const services = {
  publicFlightService: new PublicFlightService(),
  publicRunwayService: new PublicRunwayService(),
  adsbService: new AdsbService(),
};

export function usePublicApi() {
  return services;
}
