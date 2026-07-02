import { AdsbService } from "~/features/adsb/service";
import { PublicFlightService } from "~/state/api/flight.service";
import { PublicParkingPositionService } from "~/state/api/parking-position.service";
import { PublicRunwayService } from "~/state/api/runway.service";
import { PublicTerminalService } from "~/state/api/terminal.service";

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
