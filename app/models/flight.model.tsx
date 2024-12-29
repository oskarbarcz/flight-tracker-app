import { Aircraft, Airport, Operator, Schedule } from "~/models";

export interface Flight {
  flightNumber: string;
  callsign: string;
  departure: Airport;
  arrival: Airport;
  alternates: Airport[];
  operator: Operator;
  aircraft: Aircraft;
  timesheet: Schedule;
  status:
    | "future"
    | "ready"
    | "boarding-started"
    | "boarding-ended"
    | "taxiing-out"
    | "cruise"
    | "taxiing-in"
    | "on-Block"
    | "deboarding-started"
    | "closed";
}

export interface AirportOnFlight {
  id: string;
  icaoCode: string;
  country: string;
  type:
    | "departure"
    | "destination"
    | "etops_alternate"
    | "destination_alternate";
  timezone: string;
}

export interface ScheduledFlightsListElement {
  id: string;
  flightNumber: string;
  airports: AirportOnFlight[];
  callsign: string;
  aircraft: Aircraft;
  timesheet: Schedule;
  status: string;
}
