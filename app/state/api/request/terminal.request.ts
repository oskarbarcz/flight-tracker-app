import type { Terminal } from "~/models";
import type { Coordinates } from "~/models/runway.model";

export type CreateTerminalRequest = Omit<Terminal, "id" | "airportId" | "shape"> & {
  shape?: Coordinates[] | null;
};
export type EditTerminalRequest = CreateTerminalRequest;
export type GetTerminalResponse = Terminal;
