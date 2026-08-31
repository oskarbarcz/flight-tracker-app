import { type FlightLoadsheet, type Loadsheet, LoadsheetKind, type Loadsheets } from "~/features/flight/model";
import type { ApiFlightLoadsheetResponse } from "~/features/flight/request";

export const NO_LOADSHEETS: Loadsheets = { preliminary: null, final: null };

export const EMPTY_LOADSHEET: Loadsheet = {
  flightCrew: { pilots: 0, reliefPilots: 0, cabinCrew: 0 },
  passengers: 0,
  zeroFuelWeight: 0,
  cargo: 0,
  payload: 0,
  blockFuel: 0,
  fuel: null,
};

export function parseFlightLoadsheet(response: ApiFlightLoadsheetResponse): FlightLoadsheet {
  return { ...response, issuedAt: new Date(response.issuedAt) };
}

export function latestLoadsheets(history: FlightLoadsheet[]): Loadsheets {
  const latestOf = (kind: LoadsheetKind) =>
    history.reduce<FlightLoadsheet | null>(
      (latest, loadsheet) =>
        loadsheet.kind !== kind || (latest !== null && latest.revision > loadsheet.revision) ? latest : loadsheet,
      null,
    );

  return {
    preliminary: latestOf(LoadsheetKind.Preliminary),
    final: latestOf(LoadsheetKind.Final),
  };
}
