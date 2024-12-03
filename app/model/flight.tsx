import Airport from "~/model/airport";
import Operator from "~/model/operator";
import Aircraft from "~/model/aircraft";
import Timesheet from "~/model/times";

export interface Flight {
  flightNumber: string;
  callsign: string;
  departure: Airport;
  arrival: Airport;
  alternates: Airport[];
  operator: Operator;
  aircraft: Aircraft;
  timesheet: Timesheet;
  status: 'future'
    | 'ready'
    | 'boarding-started'
    | 'boarding-ended'
    | 'taxiing-out'
    | 'cruise'
    | 'taxiing-in'
    | 'on-block'
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
  timesheet: Timesheet;
  status: 'future' | 'ready'
}