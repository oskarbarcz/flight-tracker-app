import type { DisplayMode } from "~/app-state/useMapSettings";
import type { Gate } from "~/features/gate";
import type { ParkingPosition } from "~/features/parking-position";
import type { Runway } from "~/features/runway";
import type { Terminal } from "~/features/terminal";

export function pickRunways(runways: Runway[], assignedId: string | null, mode: DisplayMode): Runway[] {
  if (mode === "none") return [];
  if (mode === "all") return runways;
  return runways.filter((runway) => runway.id === assignedId);
}

export function pickParkingPositions(
  parkingPositions: ParkingPosition[],
  assignedId: string | null,
  mode: DisplayMode,
): ParkingPosition[] {
  if (mode === "none") return [];
  if (mode === "all") return parkingPositions;
  return parkingPositions.filter((parkingPosition) => parkingPosition.id === assignedId);
}

export function pickTerminals(
  terminals: Terminal[],
  parkingPositions: ParkingPosition[],
  assignedParkingPositionId: string | null,
  mode: DisplayMode,
): Terminal[] {
  if (mode === "none") return [];
  if (mode === "all") return terminals;
  if (assignedParkingPositionId === null) return [];
  const assignedTerminalId = parkingPositions.find(
    (parkingPosition) => parkingPosition.id === assignedParkingPositionId,
  )?.terminalId;
  if (!assignedTerminalId) return [];
  return terminals.filter((terminal) => terminal.id === assignedTerminalId);
}

export function pickGates(gates: Gate[], assignedParkingPositionId: string | null, mode: DisplayMode): Gate[] {
  if (mode === "none") return [];
  if (mode === "all") return gates;
  if (assignedParkingPositionId === null) return [];
  return gates.filter((gate) => gate.parkingPositionId === assignedParkingPositionId);
}
