import type { Gate, Terminal } from "~/models";

export type TerminalGateGroup = {
  terminal: Terminal | null;
  gates: Gate[];
};

export function groupGatesByTerminal(gates: Gate[], terminals: Terminal[]): TerminalGateGroup[] {
  const byId = new Map(terminals.map((t) => [t.id, t]));
  const groups = new Map<string, TerminalGateGroup>();
  for (const gate of gates) {
    const existing = groups.get(gate.terminalId);
    if (existing) {
      existing.gates.push(gate);
    } else {
      groups.set(gate.terminalId, { terminal: byId.get(gate.terminalId) ?? null, gates: [gate] });
    }
  }
  const sortedGroups = Array.from(groups.values()).sort((a, b) => {
    const aName = a.terminal?.shortName ?? "";
    const bName = b.terminal?.shortName ?? "";
    return aName.localeCompare(bName, undefined, { numeric: true });
  });
  for (const group of sortedGroups) {
    group.gates.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }
  return sortedGroups;
}
