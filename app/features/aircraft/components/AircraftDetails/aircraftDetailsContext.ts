import { useOutletContext } from "react-router";
import type { Aircraft, AircraftReposition, FlightHistoryEntry } from "~/features/aircraft";
import type { Operator } from "~/features/operator";

export type AircraftDetailsContext = {
  aircraft: Aircraft;
  history: FlightHistoryEntry[];
  repositions: AircraftReposition[];
  operator: Operator;
  operatorId: string;
  refresh: () => void;
};

export function useAircraftDetails(): AircraftDetailsContext {
  return useOutletContext<AircraftDetailsContext>();
}
