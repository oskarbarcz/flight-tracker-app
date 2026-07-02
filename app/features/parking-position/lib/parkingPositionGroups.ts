import type { ParkingPosition } from "~/features/parking-position";
import type { Terminal } from "~/features/terminal";

export type TerminalParkingPositionGroup = {
  terminal: Terminal | null;
  parkingPositions: ParkingPosition[];
};

export function groupParkingPositionsByTerminal(
  parkingPositions: ParkingPosition[],
  terminals: Terminal[],
): TerminalParkingPositionGroup[] {
  const byId = new Map(terminals.map((t) => [t.id, t]));
  const groups = new Map<string, TerminalParkingPositionGroup>();
  for (const parkingPosition of parkingPositions) {
    const existing = groups.get(parkingPosition.terminalId);
    if (existing) {
      existing.parkingPositions.push(parkingPosition);
    } else {
      groups.set(parkingPosition.terminalId, {
        terminal: byId.get(parkingPosition.terminalId) ?? null,
        parkingPositions: [parkingPosition],
      });
    }
  }
  const sortedGroups = Array.from(groups.values()).sort((a, b) => {
    const aName = a.terminal?.shortName ?? "";
    const bName = b.terminal?.shortName ?? "";
    return aName.localeCompare(bName, undefined, { numeric: true });
  });
  for (const group of sortedGroups) {
    group.parkingPositions.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }
  return sortedGroups;
}
