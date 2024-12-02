import Airport from "~/model/airport";
import Operator from "~/model/operator";
import Aircraft from "~/model/aircraft";
import Timesheet from "~/model/times";

export default interface Flight {
  flightNumber: string;
  callsign: string;
  departure: Airport;
  arrival: Airport;
  alternates: Airport[];
  operator: Operator;
  aircraft: Aircraft;
  timesheet: Timesheet;
}