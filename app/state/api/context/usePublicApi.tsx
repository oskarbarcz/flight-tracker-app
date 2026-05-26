import { AdsbService } from "~/state/api/adsb.service";
import { PublicFlightService } from "~/state/api/flight.service";
import { PublicGateService } from "~/state/api/gate.service";
import { PublicRunwayService } from "~/state/api/runway.service";
import { PublicTerminalService } from "~/state/api/terminal.service";

const services = {
  publicFlightService: new PublicFlightService(),
  publicRunwayService: new PublicRunwayService(),
  publicTerminalService: new PublicTerminalService(),
  publicGateService: new PublicGateService(),
  adsbService: new AdsbService(),
};

export function usePublicApi() {
  return services;
}
