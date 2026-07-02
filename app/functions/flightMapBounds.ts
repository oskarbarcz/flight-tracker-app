import type { Diversion, Flight } from "~/models";
import type { Position } from "~/shared/models/geo";

export type FlightMapPositions = {
  departurePosition: Position;
  destinationPosition: Position;
  diversionPosition: Position | null;
  boundsPoints: Position[];
};

export function flightMapPositions(flight: Flight, diversion: Diversion | null): FlightMapPositions {
  const departurePosition: Position = [
    flight.departureAirport.location.latitude,
    flight.departureAirport.location.longitude,
  ];
  const destinationPosition: Position = [
    flight.destinationAirport.location.latitude,
    flight.destinationAirport.location.longitude,
  ];
  const diversionPosition: Position | null = diversion
    ? [diversion.airport.location.latitude, diversion.airport.location.longitude]
    : null;
  const boundsPoints: Position[] = diversionPosition
    ? [departurePosition, destinationPosition, diversionPosition]
    : [departurePosition, destinationPosition];
  return { departurePosition, destinationPosition, diversionPosition, boundsPoints };
}
