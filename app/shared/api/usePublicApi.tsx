import { AdsbService } from "~/features/adsb/service";
import { PublicParkingPositionService } from "~/features/parking-position/service";
import { PublicRunwayService } from "~/features/runway/service";
import { PublicTerminalService } from "~/features/terminal/service";
import { PublicFlightService } from "~/state/api/flight.service";

const services = {
  publicFlightService: new PublicFlightService(),
  publicRunwayService: new PublicRunwayService(),
  publicTerminalService: new PublicTerminalService(),
  publicParkingPositionService: new PublicParkingPositionService(),
  adsbService: new AdsbService(),
};

export function usePublicApi() {
  return services;
}
