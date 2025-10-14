import {
  Aircraft,
  Airport,
  CheckedInFlightTimesheet,
  Operator,
  Timesheet,
} from "~/models";
import { ApiFlightResponse } from "~/state/api/model/flight.dto";

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

export class Flight {
  id: string;
  flightNumber: string;
  callsign: string;
  airports: AirportOnFlight[];
  aircraft: Aircraft;
  operator: Operator;
  timesheet: Timesheet | CheckedInFlightTimesheet;
  status: FlightStatus;
  loadsheets: Loadsheets;

  constructor(flight: ApiFlightResponse) {
    this.id = flight.id;
    this.flightNumber = flight.flightNumber;
    this.callsign = flight.callsign;
    this.airports = flight.airports;
    this.aircraft = flight.aircraft;
    this.operator = flight.operator;
    this.timesheet = flight.timesheet;
    this.status = flight.status;
    this.loadsheets = {
      preliminary: flight.loadsheets.preliminary,
      final: flight.loadsheets.final,
    };
  }

  get departureAirport(): AirportOnFlight {
    return this.airports.find(
      (airport) => airport.type === AirportOnFlightType.Departure,
    ) as AirportOnFlight;
  }

  get destinationAirport(): AirportOnFlight {
    return this.airports.find(
      (airport) => airport.type === AirportOnFlightType.Destination,
    ) as AirportOnFlight;
  }

  get flightNumberWithoutSpaces(): string {
    return this.flightNumber.replace(/\s+/g, "");
  }
}

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

export type FlightPathElement = {
  callsign: string;
  date: string;
  latitude: number;
  longitude: number;
};

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
