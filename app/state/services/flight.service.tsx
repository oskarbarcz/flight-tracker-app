import { getOneFlight } from "~/store/flight-provider";
import { Flight } from "~/models";

export const flightService = {
  fetchTrackedFlightById: (flightNumber: string): Flight => {
    const flight = getOneFlight();

    return { ...flight, flightNumber };
  },
};
