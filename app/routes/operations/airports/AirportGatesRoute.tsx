import React, { useState } from "react";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import type { Gate } from "~/features/gate";
import { GateList } from "~/features/gate/components/GateList";
import { GateListEmptyState } from "~/features/gate/components/GateListEmptyState";
import { RemoveGateModal } from "~/features/gate/components/RemoveGateModal";
import { useApi } from "~/shared/api/useApi";
import { NoFilterMatchesState } from "~/shared/ui/Filter/NoFilterMatchesState";

export default function AirportGatesRoute() {
  const { airport, gates, terminals, parkingPositions, isFiltered, clearFilter } = useAirportManagement();
  const [pendingRemove, setPendingRemove] = useState<Gate | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const { gateService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleRemove = async (gate: Gate) => {
    setIsRemoving(true);
    try {
      await gateService.remove(airport.id, gate.id);
      success(`Gate ${gate.name} deleted.`);
      setPendingRemove(null);
      revalidator.revalidate();
    } catch {
      error("Failed to delete gate.");
    } finally {
      setIsRemoving(false);
    }
  };

  if (gates.length === 0) {
    return isFiltered ? (
      <NoFilterMatchesState subject="gates" onClear={clearFilter} />
    ) : (
      <GateListEmptyState airportId={airport.id} hasTerminals={terminals.length > 0} />
    );
  }

  return (
    <>
      <GateList
        airportId={airport.id}
        gates={gates}
        terminals={terminals}
        parkingPositions={parkingPositions}
        onDelete={setPendingRemove}
        isFiltered={isFiltered}
      />
      {pendingRemove && (
        <RemoveGateModal
          gate={pendingRemove}
          remove={handleRemove}
          cancel={() => setPendingRemove(null)}
          isPending={isRemoving}
        />
      )}
    </>
  );
}
