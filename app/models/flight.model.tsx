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

export default function describeStatus(status: FlightStatus): string {
  const statuses = {
    [FlightStatus.Created]: "Created",
    [FlightStatus.Ready]: "Ready",
    [FlightStatus.CheckedIn]: "Checked in",
    [FlightStatus.BoardingStarted]: "Boarding in progress",
    [FlightStatus.BoardingFinished]: "Boarding finished",
    [FlightStatus.TaxiingOut]: "Taxiing out",
    [FlightStatus.InCruise]: "In cruise",
    [FlightStatus.TaxiingIn]: "Taxiing in",
    [FlightStatus.OnBlock]: "On block",
    [FlightStatus.OffboardingStarted]: "Offboarding in progress",
    [FlightStatus.OffboardingFinished]: "Offboarding was finished",
    [FlightStatus.Closed]: "Closed",
  };

  return statuses[status];
}

export function describeNextActionStatus(status: FlightStatus): string | null {
  switch (status) {
    case FlightStatus.Ready:
      return "Go to flight check-in";
    case FlightStatus.CheckedIn:
      return "Start boarding";
    case FlightStatus.BoardingStarted:
      return "Fill final loadsheet and finish boarding";
    case FlightStatus.BoardingFinished:
      return "Report off-block";
    case FlightStatus.TaxiingOut:
      return "Report takeoff";
    case FlightStatus.InCruise:
      return "Report arrival";
    case FlightStatus.TaxiingIn:
      return "Report on-block";
    case FlightStatus.OnBlock:
      return "Start offboarding";
    case FlightStatus.OffboardingStarted:
      return "Finish offboarding";
    case FlightStatus.OffboardingFinished:
      return "Close flight";
    default:
      return null;
  }
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

export enum FlightEventScope {
  System = "system",
  Operations = "operations",
  User = "user",
}

export enum FlightEventType {
  FlightWasCreated = "flight.created",
  PreliminaryLoadsheetWasUpdated = "flight.preliminary-loadsheet-updated",
  ScheduledTimesheetWasUpdated = "flight.scheduled-timesheet-updated",
  FlightWasAddedToRotation = "flight.added-to-rotation",
  FlightWasRemovedFromRotation = "flight.removed-from-rotation",
  FlightWasReleased = "flight.released",
  PilotCheckedIn = "flight.pilot-checked-in",
  BoardingWasStarted = "flight.boarding-started",
  BoardingWasFinished = "flight.boarding-finished",
  OffBlockWasReported = "flight.off-block-reported",
  TakeoffWasReported = "flight.takeoff-reported",
  ArrivalWasReported = "flight.arrival-reported",
  OnBlockWasReported = "flight.on-block-reported",
  OffboardingWasStarted = "flight.offboarding-started",
  OffboardingWasFinished = "flight.offboarding-finished",
  FlightWasClosed = "flight.closed",
  FlightTrackWasSaved = "flight.track-saved",
}

export type FlightEvent = {
  id: string;
  scope: FlightEventScope;
  type: FlightEventType;
  payload: never;
  actor: {
    id: string;
    name: string;
  };
  createdAt: Date;
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
