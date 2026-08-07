import React, { useState } from "react";
import { Outlet, useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import type { Terminal } from "~/features/terminal";
import { RemoveTerminalModal } from "~/features/terminal/components/RemoveTerminalModal";
import { TerminalList } from "~/features/terminal/components/TerminalList";
import { TerminalListEmptyState } from "~/features/terminal/components/TerminalListEmptyState";
import { useApi } from "~/shared/api/useApi";
import { NoFilterMatchesState } from "~/shared/ui/Filter/NoFilterMatchesState";

export default function AirportTerminalsRoute() {
  const context = useAirportManagement();
  const { airport, terminals, isFiltered, clearFilter } = context;
  const [pendingRemove, setPendingRemove] = useState<Terminal | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const { terminalService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleRemove = async (terminal: Terminal) => {
    setIsRemoving(true);
    try {
      await terminalService.remove(airport.id, terminal.id);
      success(`Terminal ${terminal.shortName} deleted.`);
      setPendingRemove(null);
      revalidator.revalidate();
    } catch {
      error("Failed to delete terminal.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      {terminals.length > 0 && (
        <TerminalList airportId={airport.id} terminals={terminals} onDelete={setPendingRemove} />
      )}
      {terminals.length === 0 &&
        (isFiltered ? (
          <NoFilterMatchesState subject="terminals" onClear={clearFilter} />
        ) : (
          <TerminalListEmptyState airportId={airport.id} />
        ))}

      {pendingRemove && (
        <RemoveTerminalModal
          terminal={pendingRemove}
          remove={handleRemove}
          cancel={() => setPendingRemove(null)}
          isPending={isRemoving}
        />
      )}

      <Outlet context={context} />
    </>
  );
}
