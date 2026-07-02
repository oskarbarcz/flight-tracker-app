import type { Coordinates } from "~/shared/models/coordinates";
import type { Terminal } from "~/features/terminal";

export type CreateTerminalRequest = Omit<Terminal, "id" | "airportId" | "shape"> & {
  shape?: Coordinates[] | null;
};
export type EditTerminalRequest = CreateTerminalRequest;
export type GetTerminalResponse = Terminal;
