import type { Airframe } from "~/features/airframe/model";
import type { FlightStatus } from "~/features/flight/model";
import type { Coordinates } from "~/shared/models/coordinates";

export enum AircraftState {
  Idle = "idle",
  Planned = "planned",
  CheckedIn = "checked_in",
  Cruise = "cruise",
}

export type AircraftAirport = {
  id: string;
  iataCode: string;
  name: string;
  city: string;
  country: string;
  location: Coordinates;
};

export type AircraftParkingPosition = {
  id: string;
  name: string;
  coordinates: Coordinates | null;
};

export type Aircraft = {
  id: string;
  airframe: Airframe;
  registration: string;
  selcal: string | null;
  livery: string;
  currentState: AircraftState;
  baseAirport: AircraftAirport | null;
  etopsThresholdMinutes: number | null;
  lastAirport: AircraftAirport | null;
  lastAirportUpdatedAt: string | null;
  lastParkingPosition: AircraftParkingPosition | null;
};

export type UserAircraftEntryOperator = {
  id: string;
  icaoCode: string;
  iataCode: string;
  shortName: string;
  fullName: string;
  callsign: string;
};

export type UserAircraftEntryAirport = {
  id: string;
  iataCode: string;
};

export type UserAircraftEntryFlight = {
  id: string;
  flightNumber: string;
  departureAirport: UserAircraftEntryAirport;
  arrivalAirport: UserAircraftEntryAirport;
};

export type UserAircraftEntry = {
  id: string;
  registration: string;
  airframe: Airframe;
  livery: string;
  operator: UserAircraftEntryOperator;
  flight: UserAircraftEntryFlight;
};

export type FlightHistoryAirport = {
  id: string;
  name: string;
  iataCode: string;
};

export type FlightHistoryTimesheet = {
  offBlockTime: string | null;
  takeoffTime: string | null;
  arrivalTime: string | null;
  onBlockTime: string | null;
};

export type FlightHistoryEntry = {
  id?: string;
  flightNumber: string;
  status: FlightStatus;
  departureAirport: FlightHistoryAirport;
  arrivalAirport: FlightHistoryAirport;
  actualTimesheet: FlightHistoryTimesheet | null;
};

export enum RepositionType {
  PerformingFlight = "performing_flight",
  DeadHeadManual = "dead_head_manual",
  DeadHeadAutomatic = "dead_head_automatic",
}

export enum RepositionStatus {
  Pending = "pending",
  Finished = "finished",
}

export type RepositionAirport = {
  id: string;
  name: string;
  iataCode: string;
};

export type AircraftReposition = {
  id: string;
  aircraftId: string;
  type: RepositionType;
  status: RepositionStatus;
  departureAirport: RepositionAirport;
  destinationAirport: RepositionAirport;
  distance: number;
  flightId: string | null;
  createdAt: string;
  updatedAt: string | null;
};
