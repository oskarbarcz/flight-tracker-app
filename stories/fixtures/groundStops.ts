import type { AirportLayout } from "~/features/airport/hooks/useAirportLayout";
import { AirportOnFlightType, type Flight, FlightStatus } from "~/features/flight";
import type { GroundStop } from "~/features/flight/hooks/useGroundStop";
import { flightFixture } from "./flights";
import newYork from "./new-york-layout.json";

const HOUR = 3_600_000;

export const newYorkLayout = newYork as unknown as AirportLayout;

export const newYorkLayoutWithoutStand: AirportLayout = { ...newYorkLayout, stand: null, standTerminal: null };

const arrivalFlight = flightFixture({ route: "longHaul", status: FlightStatus.Closed });

export function groundStopAfterFlight(hoursOnGround = 4.6): GroundStop {
  return {
    airport: arrivalFlight.destinationAirport,
    since: new Date(Date.now() - hoursOnGround * HOUR),
    sinceEvent: "On-block",
    arrivedOn: arrivalFlight,
  };
}

export function groundStopAfterDeadHead(hoursOnGround = 1.25): GroundStop {
  return {
    airport: arrivalFlight.destinationAirport,
    since: new Date(Date.now() - hoursOnGround * HOUR),
    sinceEvent: "Arrival",
    arrivedOn: null,
  };
}

export function flightFromNewYork(): Flight {
  const flight = flightFixture({ route: "longHaul", status: FlightStatus.Ready });
  const swapped: Partial<Record<AirportOnFlightType, AirportOnFlightType>> = {
    [AirportOnFlightType.Departure]: AirportOnFlightType.Destination,
    [AirportOnFlightType.Destination]: AirportOnFlightType.Departure,
  };

  flight.airports = flight.airports.map((airport) => ({ ...airport, type: swapped[airport.type] ?? airport.type }));

  return flight;
}

export function flightFromBoston(): Flight {
  return flightFixture({ route: "short", status: FlightStatus.Ready });
}
