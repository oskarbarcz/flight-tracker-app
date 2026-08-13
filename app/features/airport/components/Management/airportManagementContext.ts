import { useOutletContext } from "react-router";
import type { Airport } from "~/features/airport";
import type { AirportSection } from "~/features/airport/components/Management/airportSections";
import type { Gate } from "~/features/gate";
import type { Notam } from "~/features/notam";
import type { ParkingPosition } from "~/features/parking-position";
import type { Runway } from "~/features/runway";
import type { Terminal } from "~/features/terminal";

export type AirportManagementData = {
  airport: Airport;
  runways: Runway[];
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  gates: Gate[];
  notams: Notam[] | null;
};

export type AirportManagementContext = AirportManagementData & {
  isFiltered: boolean;
  clearFilter: () => void;
};

export function sectionItemCount(section: AirportSection, data: AirportManagementData): number {
  return data[section.key]?.length ?? 0;
}

export function useAirportManagement(): AirportManagementContext {
  return useOutletContext<AirportManagementContext>();
}
