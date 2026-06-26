import type { Airframe } from "~/models/airframe.model";
import type { FlightStatus } from "~/models/flight.model";

export enum AircraftState {
  Idle = "idle",
  Planned = "planned",
  CheckedIn = "checked_in",
  Cruise = "cruise",
}

export type Aircraft = {
  id: string;
  airframe: Airframe;
  registration: string;
  selcal: string;
  livery: string;
  currentState: AircraftState;
  baseAirportId: string | null;
  lastAirportId: string | null;
  lastAirportUpdatedAt: string | null;
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
