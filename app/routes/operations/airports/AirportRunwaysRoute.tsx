import React, { useState } from "react";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import type { Runway } from "~/features/runway";
import { RemoveRunwayModal } from "~/features/runway/components/RemoveRunwayModal";
import { RunwayList } from "~/features/runway/components/RunwayList";
import { RunwayListEmptyState } from "~/features/runway/components/RunwayListEmptyState";
import { useApi } from "~/shared/api/useApi";
import { NoFilterMatchesState } from "~/shared/ui/Filter/NoFilterMatchesState";

export default function AirportRunwaysRoute() {
  const { airport, runways, isFiltered, clearFilter } = useAirportManagement();
  const [pendingRemove, setPendingRemove] = useState<Runway | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const { runwayService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleRemove = async (runway: Runway) => {
    setIsRemoving(true);
    try {
      await runwayService.remove(airport.id, runway.id);
      success(`Runway ${runway.designator} deleted.`);
      setPendingRemove(null);
      revalidator.revalidate();
    } catch {
      error("Failed to delete runway.");
    } finally {
      setIsRemoving(false);
    }
  };

  if (runways.length === 0) {
    return isFiltered ? (
      <NoFilterMatchesState subject="runways" onClear={clearFilter} />
    ) : (
      <RunwayListEmptyState airportId={airport.id} />
    );
  }

  return (
    <>
      <RunwayList airportId={airport.id} runways={runways} onDelete={setPendingRemove} />
      {pendingRemove && (
        <RemoveRunwayModal
          runway={pendingRemove}
          remove={handleRemove}
          cancel={() => setPendingRemove(null)}
          isPending={isRemoving}
        />
      )}
    </>
  );
}
