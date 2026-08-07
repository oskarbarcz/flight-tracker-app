import React, { useState } from "react";
import { Outlet, useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import type { Runway } from "~/features/runway";
import { RemoveRunwayModal } from "~/features/runway/components/RemoveRunwayModal";
import { RunwayList } from "~/features/runway/components/RunwayList";
import { RunwayListEmptyState } from "~/features/runway/components/RunwayListEmptyState";
import { useApi } from "~/shared/api/useApi";
import { NoFilterMatchesState } from "~/shared/ui/Filter/NoFilterMatchesState";

export default function AirportRunwaysRoute() {
  const context = useAirportManagement();
  const { airport, runways, isFiltered, clearFilter } = context;
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

  return (
    <>
      {runways.length > 0 && <RunwayList airportId={airport.id} runways={runways} onDelete={setPendingRemove} />}
      {runways.length === 0 &&
        (isFiltered ? (
          <NoFilterMatchesState subject="runways" onClear={clearFilter} />
        ) : (
          <RunwayListEmptyState airportId={airport.id} />
        ))}

      {pendingRemove && (
        <RemoveRunwayModal
          runway={pendingRemove}
          remove={handleRemove}
          cancel={() => setPendingRemove(null)}
          isPending={isRemoving}
        />
      )}

      <Outlet context={context} />
    </>
  );
}
