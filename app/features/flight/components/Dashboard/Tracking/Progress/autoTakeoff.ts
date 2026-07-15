import { type Flight, type FlightEvent, FlightEventType } from "~/features/flight";

export function hasDepartureShape(flight: Flight): boolean {
  return (flight.departureAirport?.shape?.length ?? 0) >= 3;
}

export function hasDestinationShape(flight: Flight): boolean {
  return (flight.destinationAirport?.shape?.length ?? 0) >= 3;
}

export function hasLivePosition(events: FlightEvent[]): boolean {
  return events.some((event) => event.type === FlightEventType.LivePositionReceived);
}
