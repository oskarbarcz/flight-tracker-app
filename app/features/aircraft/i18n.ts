import { AircraftState } from "~/features/aircraft/model";

const aircraftStateLabels: Record<AircraftState, string> = {
  [AircraftState.Idle]: "Idle",
  [AircraftState.Planned]: "Planned",
  [AircraftState.CheckedIn]: "Checked in",
  [AircraftState.Cruise]: "In cruise",
};

export const aircraftStateColors: Record<AircraftState, string> = {
  [AircraftState.Idle]: "gray",
  [AircraftState.Planned]: "purple",
  [AircraftState.CheckedIn]: "indigo",
  [AircraftState.Cruise]: "info",
};

export function translateAircraftState(state: AircraftState): string {
  return aircraftStateLabels[state] ?? state;
}
