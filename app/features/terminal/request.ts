import type { Coordinates } from "~/features/runway/model";
import type { Terminal } from "~/features/terminal";

export type CreateTerminalRequest = Omit<Terminal, "id" | "airportId" | "shape"> & {
  shape?: Coordinates[] | null;
};
export type EditTerminalRequest = CreateTerminalRequest;
export type GetTerminalResponse = Terminal;
