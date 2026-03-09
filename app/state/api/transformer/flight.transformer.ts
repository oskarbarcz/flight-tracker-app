import { Tracking } from "~/models";
import type { CreateFlightFormData } from "~/models/form/flight.form";
import type { CreateFlightRequest } from "~/state/api/request/flight.request";

export function formDataToApiFormat(input: CreateFlightFormData): CreateFlightRequest {
  return {
    flightNumber: input.identity.flightNumber,
    callsign: input.identity.callsign,
    departureAirportId: input.route.departureAirportId,
    destinationAirportId: input.route.destinationAirportId,
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
