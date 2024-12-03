import {getOneFlight} from "~/store/flight-provider";
import {Flight} from "~/models";

export const flightService = {
  fetchTrackedFlightById: (id: string): Flight => getOneFlight()
}