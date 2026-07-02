import { type Aircraft, AircraftState, type FlightHistoryAirport, type FlightHistoryEntry } from "~/features/aircraft";
import { FlightStatus } from "~/features/flight";

export type AircraftStatusView =
  | { kind: "parked"; airport: FlightHistoryAirport | null; since: Date | null; flight: FlightHistoryEntry | null }
  | { kind: "assigned"; flight: FlightHistoryEntry }
  | { kind: "cruise"; flight: FlightHistoryEntry }
  | { kind: "unknown" };

export function entryTime(entry: FlightHistoryEntry): number {
  const timesheet = entry.actualTimesheet;
  const candidate =
    timesheet?.onBlockTime ?? timesheet?.arrivalTime ?? timesheet?.takeoffTime ?? timesheet?.offBlockTime;
  return candidate ? new Date(candidate).getTime() : 0;
}

function mostRecent(entries: FlightHistoryEntry[]): FlightHistoryEntry | null {
  if (entries.length === 0) return null;
  return entries.reduce((latest, entry) => (entryTime(entry) >= entryTime(latest) ? entry : latest));
}

function activeFlight(history: FlightHistoryEntry[]): FlightHistoryEntry | null {
  return mostRecent(history.filter((entry) => entry.status !== FlightStatus.Closed));
}

function lastClosedFlight(history: FlightHistoryEntry[]): FlightHistoryEntry | null {
  return mostRecent(history.filter((entry) => entry.status === FlightStatus.Closed));
}

export function deriveAircraftStatus(aircraft: Aircraft, history: FlightHistoryEntry[]): AircraftStatusView {
  switch (aircraft.currentState) {
    case AircraftState.Cruise: {
      const flight = activeFlight(history);
      return flight ? { kind: "cruise", flight } : { kind: "unknown" };
    }
    case AircraftState.Planned:
    case AircraftState.CheckedIn: {
      const flight = activeFlight(history);
      return flight ? { kind: "assigned", flight } : { kind: "unknown" };
    }
    case AircraftState.Idle: {
      const flight = lastClosedFlight(history);
      const onBlock = flight?.actualTimesheet?.onBlockTime ?? null;
      return {
        kind: "parked",
        airport: flight?.arrivalAirport ?? null,
        since: onBlock ? new Date(onBlock) : null,
        flight,
      };
    }
    default:
      return { kind: "unknown" };
  }
}
