import type { Aircraft } from "~/features/aircraft";
import type { Airport } from "~/features/airport";
import type { ApiFlightResponse } from "~/features/flight/request";
import type { Operator } from "~/features/operator";

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
  DestinationAlternate = "destination_alternate",
  EtopsEntry = "etops_entry",
  EtopsExit = "etops_exit",
  EnrouteAlternate = "enroute_alternate",
}

export enum FlightPhase {
  Emergency = "emergency",
  Upcoming = "upcoming",
  Ongoing = "ongoing",
  Finished = "finished",
}

export enum Tracking {
  Disabled = "disabled",
  Private = "private",
  Public = "public",
}

export function shouldPollForAdsbData(status: FlightStatus): boolean {
  const trackableStatuses = [FlightStatus.TaxiingOut, FlightStatus.InCruise, FlightStatus.TaxiingIn];

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

export type Pilot = {
  id: string;
  name: string;
  pilotLicenseId: string;
  totalFlightTime: number;
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

export enum FlightSource {
  Manual = "manual",
  SimBrief = "simbrief",
}

export class Flight {
  id: string;
  flightNumber: string;
  callsign: string;
  tracking: Tracking;
  source: FlightSource;
  airports: AirportOnFlight[];
  aircraft: Aircraft;
  operator: Operator;
  pilot: Pilot | null;
  timesheet: Timesheet;
  status: FlightStatus;
  loadsheets: Loadsheets;
  rotationId: string | null;
  departureParkingPositionId: string | null;
  departureRunwayId: string | null;
  arrivalParkingPositionId: string | null;
  arrivalRunwayId: string | null;
  hasActiveEmergency: boolean;
  isFlightDiverted: boolean;
  hasFlightPath: boolean;
  createdAt: Date;

  constructor(flight: ApiFlightResponse) {
    this.id = flight.id;
    this.flightNumber = flight.flightNumber;
    this.source = flight.source as FlightSource;
    this.callsign = flight.callsign;
    this.airports = flight.airports;
    this.tracking = flight.tracking;
    this.aircraft = flight.aircraft;
    this.operator = flight.operator;
    this.pilot = flight.pilot ?? null;
    this.rotationId = flight.rotationId;
    this.timesheet = parseTimesheet(flight.timesheet);
    this.status = flight.status;
    this.loadsheets = {
      preliminary: flight.loadsheets.preliminary,
      final: flight.loadsheets.final,
    };
    this.departureParkingPositionId = flight.departureParkingPositionId;
    this.departureRunwayId = flight.departureRunwayId;
    this.arrivalParkingPositionId = flight.arrivalParkingPositionId;
    this.arrivalRunwayId = flight.arrivalRunwayId;
    this.hasActiveEmergency = flight.hasActiveEmergency ?? false;
    this.isFlightDiverted = flight.isFlightDiverted ?? false;
    this.hasFlightPath = flight.hasFlightPath;
    this.createdAt = new Date(flight.createdAt);
  }

  get departureAirport(): AirportOnFlight {
    return this.airports.find((airport) => airport.type === AirportOnFlightType.Departure) as AirportOnFlight;
  }

  get destinationAirport(): AirportOnFlight {
    return this.airports.find((airport) => airport.type === AirportOnFlightType.Destination) as AirportOnFlight;
  }

  get flightNumberWithoutSpaces(): string {
    return this.flightNumber.replace(/\s+/g, "");
  }
}

export type FlightOfp = {
  ofpContent: string;
  ofpDocumentUrl: string;
  runwayAnalysis: string;
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
  DepartureParkingPositionWasChanged = "flight.departure-parking-position-changed",
  DepartureRunwayWasChanged = "flight.departure-runway-changed",
  ArrivalParkingPositionWasChanged = "flight.arrival-parking-position-changed",
  ArrivalRunwayWasChanged = "flight.arrival-runway-changed",
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
  EmergencyWasDeclared = "flight.emergency-declared",
  EmergencyWasUpdated = "flight.emergency-updated",
  EmergencyWasResolved = "flight.emergency-resolved",
  DiversionWasReported = "flight.diversion-reported",
  DiversionWasUpdated = "flight.diversion-updated",
  DelayRequestWasCreated = "flight.delay-request-created",
  DelayReportWasFiled = "flight.delay-report-filed",
  DelayReportWasAccepted = "flight.delay-report-accepted",
  DelayReportWasRejected = "flight.delay-report-rejected",
}

export function isEmergencyEvent(type: FlightEventType): boolean {
  return (
    type === FlightEventType.EmergencyWasDeclared ||
    type === FlightEventType.EmergencyWasUpdated ||
    type === FlightEventType.EmergencyWasResolved
  );
}

export function isDiversionEvent(type: FlightEventType): boolean {
  return type === FlightEventType.DiversionWasReported || type === FlightEventType.DiversionWasUpdated;
}

export type FlightEvent = {
  id: string;
  scope: FlightEventScope;
  type: FlightEventType;
  payload: Record<string, unknown>;
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
  altitude?: number;
  groundSpeed?: number;
  track?: number;
  verticalRate?: number;
  squawk?: string;
  isOnGround?: boolean;
  alert?: boolean;
  emergency?: boolean;
  spi?: boolean;
};

export interface Schedule {
  offBlockTime: Date | null;
  takeoffTime: Date | null;
  arrivalTime: Date | null;
  onBlockTime: Date | null;
}

export interface FilledSchedule {
  offBlockTime: Date;
  takeoffTime: Date;
  arrivalTime: Date;
  onBlockTime: Date;
}

export interface Timesheet {
  scheduled: FilledSchedule;
  estimated?: FilledSchedule;
  actual?: Schedule;
}

export function isFilledSchedule(schedule: Schedule | undefined): schedule is FilledSchedule {
  return (
    schedule !== undefined &&
    schedule.offBlockTime !== null &&
    schedule.takeoffTime !== null &&
    schedule.arrivalTime !== null &&
    schedule.onBlockTime !== null
  );
}

function parseSchedule<T extends Schedule | FilledSchedule>(data: Record<string, string | null>): T {
  return {
    offBlockTime: data.offBlockTime ? new Date(data.offBlockTime) : null,
    takeoffTime: data.takeoffTime ? new Date(data.takeoffTime) : null,
    arrivalTime: data.arrivalTime ? new Date(data.arrivalTime) : null,
    onBlockTime: data.onBlockTime ? new Date(data.onBlockTime) : null,
  } as T;
}

export function parseTimesheet(data: {
  scheduled: Record<string, string>;
  estimated?: Record<string, string | null>;
  actual?: Record<string, string | null>;
}): Timesheet {
  const scheduled = parseSchedule<FilledSchedule>(data.scheduled);
  if (!isFilledSchedule(scheduled)) {
    throw new Error("Scheduled times must be fully populated");
  }

  return {
    scheduled,
    estimated: data.estimated ? parseSchedule<FilledSchedule>(data.estimated) : undefined,
    actual: data.actual ? parseSchedule<Schedule>(data.actual) : undefined,
  };
}
