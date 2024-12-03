import {Airport, Aircraft, Operator, Schedule} from "~/models";

export interface Flight {
  flightNumber: string;
  callsign: string;
  departure: Airport;
  arrival: Airport;
  alternates: Airport[];
  operator: Operator;
  aircraft: Aircraft;
  timesheet: Schedule;
  status: 'future'
    | 'ready'
    | 'boarding-started'
    | 'boarding-ended'
    | 'taxiing-out'
    | 'cruise'
    | 'taxiing-in'
    | 'on-Block'
    | 'deboarding-started'
    | 'closed'
}

export interface ScheduledFlightsListElement {
  flightNumber: string;
  callsign: string;
  departure: Airport;
  arrival: Airport;
  alternates?: Airport[];
  aircraft: Aircraft;
  timesheet: Schedule;
  status: 'future' | 'ready'
}