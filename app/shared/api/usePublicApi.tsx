import { AdsbService } from "~/features/adsb/service";
import { PublicFlightService } from "~/features/flight/service";
import { PublicGateService } from "~/features/gate/service";
import { PublicParkingPositionService } from "~/features/parking-position/service";
import { PublicRunwayService } from "~/features/runway/service";
import { PublicTerminalService } from "~/features/terminal/service";

const services = {
  publicFlightService: new PublicFlightService(),
  publicRunwayService: new PublicRunwayService(),
  publicTerminalService: new PublicTerminalService(),
  publicParkingPositionService: new PublicParkingPositionService(),
  publicGateService: new PublicGateService(),
  adsbService: new AdsbService(),
};

export function usePublicApi() {
  return services;
}
