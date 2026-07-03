import { AirportOnFlightType, Tracking } from "~/features/flight";
import type { CreateFlightFormData } from "~/features/flight/form";
import type { AlternateAirportRequest, CreateFlightRequest } from "~/features/flight/request";

function buildAlternateAirports(route: CreateFlightFormData["route"]): AlternateAirportRequest[] {
  const destinationAlternates = route.destinationAlternates.map(({ airportId }) => ({
    airportId,
    type: AirportOnFlightType.DestinationAlternate,
  }));

  const singleAlternates: AlternateAirportRequest[] = [
    { airportId: route.etopsEntryAirportId, type: AirportOnFlightType.EtopsEntry },
    { airportId: route.etopsExitAirportId, type: AirportOnFlightType.EtopsExit },
    { airportId: route.enrouteAlternateAirportId, type: AirportOnFlightType.EnrouteAlternate },
  ];

  return [...destinationAlternates, ...singleAlternates.filter((alternate) => alternate.airportId !== "")];
}

export function formDataToApiFormat(input: CreateFlightFormData): CreateFlightRequest {
  return {
    flightNumber: input.identity.flightNumber,
    callsign: input.identity.callsign,
    departureAirportId: input.route.departureAirportId,
    destinationAirportId: input.route.destinationAirportId,
    alternateAirports: buildAlternateAirports(input.route),
    aircraftId: input.identity.aircraftId,
    operatorId: input.identity.operatorId,
    timesheet: {
      scheduled: {
        offBlockTime: input.schedule.offBlockTime.toISOString(),
        takeoffTime: input.schedule.takeoffTime.toISOString(),
        arrivalTime: input.schedule.arrivalTime.toISOString(),
        onBlockTime: input.schedule.onBlockTime.toISOString(),
      },
    },
    tracking: Tracking.Disabled,
    loadsheets: {
      preliminary: null,
      final: null,
    },
  };
}
