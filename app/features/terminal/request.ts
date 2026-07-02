import type { Terminal } from "~/features/terminal";
import type { Coordinates } from "~/shared/models/coordinates";

export type CreateTerminalRequest = Omit<Terminal, "id" | "airportId" | "shape"> & {
  shape?: Coordinates[] | null;
};
export type EditTerminalRequest = CreateTerminalRequest;
export type GetTerminalResponse = Terminal;
