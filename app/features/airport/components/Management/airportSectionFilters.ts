import type { AirportManagementData } from "~/features/airport/components/Management/airportManagementContext";
import type { AirportSection } from "~/features/airport/components/Management/airportSections";
import type { Terminal } from "~/features/terminal";
import { matchesFilter, normalizeFilter } from "~/shared/lib/textFilter";

export function filterAirportSection(
  section: AirportSection,
  data: AirportManagementData,
  filter: string,
): AirportManagementData {
  const query = normalizeFilter(filter);
  if (query === "") return data;

  const terminalsById = new Map(data.terminals.map((terminal) => [terminal.id, terminal]));
  const terminalOf = (terminalId: string | null): Terminal | undefined =>
    terminalId ? terminalsById.get(terminalId) : undefined;

  switch (section.key) {
    case "runways":
      return { ...data, runways: data.runways.filter((runway) => matchesFilter(query, runway.designator)) };
    case "terminals":
      return {
        ...data,
        terminals: data.terminals.filter((terminal) => matchesFilter(query, terminal.shortName, terminal.fullName)),
      };
    case "parkingPositions":
      return {
        ...data,
        parkingPositions: data.parkingPositions.filter((parkingPosition) => {
          const terminal = terminalOf(parkingPosition.terminalId);
          return matchesFilter(query, parkingPosition.name, terminal?.shortName, terminal?.fullName);
        }),
      };
    case "gates":
      return {
        ...data,
        gates: data.gates.filter((gate) => {
          const terminal = terminalOf(gate.terminalId);
          return matchesFilter(query, gate.name, terminal?.shortName, terminal?.fullName);
        }),
      };
  }
}
