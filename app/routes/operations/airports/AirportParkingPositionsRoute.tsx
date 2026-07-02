import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportParkingPositionsRoute";
import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { Link, useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import type { ParkingPosition } from "~/features/parking-position";
import { ParkingPositionList } from "~/features/parking-position/components/ParkingPositionList";
import { ParkingPositionListEmptyState } from "~/features/parking-position/components/ParkingPositionListEmptyState";
import { RemoveParkingPositionModal } from "~/features/parking-position/components/RemoveParkingPositionModal";
import { ParkingPositionService } from "~/features/parking-position/service";
import { TerminalService } from "~/features/terminal/service";
import { useApi } from "~/shared/api/useApi";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [parkingPositions, terminals] = await Promise.all([
    new ParkingPositionService().fetchAll(params.id),
    new TerminalService().fetchAll(params.id),
  ]);
  return { parkingPositions, terminals };
}

export default function AirportParkingPositionsRoute({ params, loaderData }: Route.ComponentProps) {
  const { parkingPositions: initialParkingPositions, terminals } = loaderData;
  const [parkingPositions, setParkingPositions] = useState<ParkingPosition[]>(initialParkingPositions);
  const [pendingRemove, setPendingRemove] = useState<ParkingPosition | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const { parkingPositionService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  useEffect(() => {
    setParkingPositions(initialParkingPositions);
  }, [initialParkingPositions]);

  const handleRemove = async (parkingPosition: ParkingPosition) => {
    setIsRemoving(true);
    try {
      await parkingPositionService.remove(params.id, parkingPosition.id);
      success(`Parking position ${parkingPosition.name} deleted.`);
      setPendingRemove(null);
      revalidator.revalidate();
    } catch {
      error("Failed to delete parking position.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      {parkingPositions.length === 0 ? (
        <ParkingPositionListEmptyState airportId={params.id} hasTerminals={terminals.length > 0} />
      ) : (
        <div>
          <div className="flex justify-end mb-3">
            <Button
              as={Link}
              color="indigo"
              size="sm"
              className="space-x-1.5"
              to={`/airports/${params.id}/parking-positions/new`}
            >
              <HiPlus />
              <span>Add parking position</span>
            </Button>
          </div>
          <ParkingPositionList
            airportId={params.id}
            parkingPositions={parkingPositions}
            terminals={terminals}
            onDelete={setPendingRemove}
          />
        </div>
      )}
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
