import type { LatLngTuple } from "leaflet";
import type { Airport } from "~/features/airport";
import type { Diversion } from "~/features/diversion";
import type { Flight } from "~/features/flight";
import { greatCirclePath } from "~/shared/lib/greatCircle";

export type FlightMapPositions = {
  departurePosition: LatLngTuple;
  destinationPosition: LatLngTuple;
  diversionPosition: LatLngTuple | null;
  boundsPoints: LatLngTuple[];
};

export function airportRoute(start: Airport, end: Airport): LatLngTuple[] {
  return greatCirclePath([
    [start.location.latitude, start.location.longitude],
    [end.location.latitude, end.location.longitude],
  ]);
}

export function flightMapPositions(flight: Flight, diversion: Diversion | null): FlightMapPositions {
  const departurePosition: LatLngTuple = [
    flight.departureAirport.location.latitude,
    flight.departureAirport.location.longitude,
  ];
  const destinationPosition: LatLngTuple = [
    flight.destinationAirport.location.latitude,
    flight.destinationAirport.location.longitude,
  ];
  const diversionPosition: LatLngTuple | null = diversion
    ? [diversion.airport.location.latitude, diversion.airport.location.longitude]
    : null;
  const boundsPoints: LatLngTuple[] = [
    ...airportRoute(flight.departureAirport, flight.destinationAirport),
    ...(diversion ? airportRoute(flight.departureAirport, diversion.airport) : []),
  ];
  return { departurePosition, destinationPosition, diversionPosition, boundsPoints };
}
