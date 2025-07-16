import {
  Aircraft,
  Airport,
  CheckedInFlightTimesheet,
  Operator,
  Timesheet,
} from "~/models";

export enum FlightStatus {
  Created = "created",
  Ready = "ready",
  CheckedIn = "checked_in",
  BoardingStarted = "boarding_started",
  BoardingFinished = "boarding_finished",
  TaxiingOut = "taxiing_out",
  InCruise = "in_cruise",
  TaxiingIn = "taxiing_in",
  OnBlock = "on_block",
  OffboardingStarted = "offboarding_started",
  OffboardingFinished = "offboarding_finished",
  Closed = "closed",
}

export enum AirportOnFlightType {
  Departure = "departure",
  Destination = "destination",
  EtopsAlternate = "etops_alternate",
  DestinationAlternate = "destination_alternate",
}

export enum FlightPrecedenceStatus {
  Upcoming = "upcoming",
  Ongoing = "ongoing",
  Finished = "finished",
}

export function precedenceToStatus(
  precedence: FlightPrecedenceStatus,
): FlightStatus[] {
  switch (precedence) {
    case FlightPrecedenceStatus.Ongoing:
      return [
        FlightStatus.CheckedIn,
        FlightStatus.BoardingStarted,
        FlightStatus.BoardingFinished,
        FlightStatus.TaxiingOut,
        FlightStatus.InCruise,
        FlightStatus.TaxiingIn,
        FlightStatus.OnBlock,
        FlightStatus.OffboardingStarted,
        FlightStatus.OffboardingFinished,
      ];
    case FlightPrecedenceStatus.Finished:
      return [FlightStatus.Closed];
    default:
      return [FlightStatus.Created, FlightStatus.Ready];
  }
}

export function isFlightTrackable(status: FlightStatus): boolean {
  const trackableStatuses = [
    FlightStatus.CheckedIn,
    FlightStatus.BoardingStarted,
    FlightStatus.BoardingFinished,
    FlightStatus.TaxiingOut,
    FlightStatus.InCruise,
    FlightStatus.TaxiingIn,
    FlightStatus.OnBlock,
    FlightStatus.OffboardingStarted,
    FlightStatus.OffboardingFinished,
  ];

  return trackableStatuses.includes(status);
}

export type AirportOnFlight = Airport & {
  type: AirportOnFlightType;
};

export type FlightCrew = {
  pilots: number;
  reliefPilots: number;
  cabinCrew: number;
};

export type Loadsheet = {
  flightCrew: FlightCrew;
  passengers: number;
  cargo: number;
  payload: number;
  zeroFuelWeight: number;
  blockFuel: number;
};

export type Loadsheets = {
  preliminary: Loadsheet | null;
  final: Loadsheet | null;
};

export type Flight = {
  id: string;
  flightNumber: string;
  callsign: string;
  airports: AirportOnFlight[];
  departureAirportId: string;
  destinationAirportId: string;
  aircraftId: string;
  aircraft: Aircraft;
  operatorId: string;
  operator: Operator;
  timesheet: Timesheet | CheckedInFlightTimesheet;
  status: FlightStatus;
  loadsheets: Loadsheets;
};

export type CreateFlightDto = Omit<
  Flight,
  "id" | "airports" | "aircraft" | "operator" | "status"
>;

export type FlightPathElement = {
  callsign: string;
  date: string;
  latitude: number;
  longitude: number;
};
