import type { Terminal } from "~/models";

export type CreateTerminalRequest = Omit<Terminal, "id" | "airportId">;
export type EditTerminalRequest = CreateTerminalRequest;
export type GetTerminalResponse = Terminal;
