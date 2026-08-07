import React, { useState } from "react";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import { useAirportManagement } from "~/features/airport/components/Management/airportManagementContext";
import type { ParkingPosition } from "~/features/parking-position";
import { ParkingPositionList } from "~/features/parking-position/components/ParkingPositionList";
import { ParkingPositionListEmptyState } from "~/features/parking-position/components/ParkingPositionListEmptyState";
import { RemoveParkingPositionModal } from "~/features/parking-position/components/RemoveParkingPositionModal";
import { useApi } from "~/shared/api/useApi";
import { NoFilterMatchesState } from "~/shared/ui/Filter/NoFilterMatchesState";

export default function AirportParkingPositionsRoute() {
  const { airport, parkingPositions, terminals, isFiltered, clearFilter } = useAirportManagement();
  const [pendingRemove, setPendingRemove] = useState<ParkingPosition | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const { parkingPositionService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleRemove = async (parkingPosition: ParkingPosition) => {
    setIsRemoving(true);
    try {
      await parkingPositionService.remove(airport.id, parkingPosition.id);
      success(`Parking position ${parkingPosition.name} deleted.`);
      setPendingRemove(null);
      revalidator.revalidate();
    } catch {
      error("Failed to delete parking position.");
    } finally {
      setIsRemoving(false);
    }
  };

  if (parkingPositions.length === 0) {
    return isFiltered ? (
      <NoFilterMatchesState subject="parking stands" onClear={clearFilter} />
    ) : (
      <ParkingPositionListEmptyState airportId={airport.id} hasTerminals={terminals.length > 0} />
    );
  }

  return (
    <>
      <ParkingPositionList
        airportId={airport.id}
        parkingPositions={parkingPositions}
        terminals={terminals}
        onDelete={setPendingRemove}
        isFiltered={isFiltered}
      />
      {pendingRemove && (
        <RemoveParkingPositionModal
          parkingPosition={pendingRemove}
          remove={handleRemove}
          cancel={() => setPendingRemove(null)}
          isPending={isRemoving}
        />
      )}
    </>
  );
}
