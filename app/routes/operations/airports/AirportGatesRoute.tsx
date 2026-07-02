import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportGatesRoute";
import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { Link, useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import type { Gate } from "~/features/gate";
import { GateList } from "~/features/gate/components/GateList";
import { GateListEmptyState } from "~/features/gate/components/GateListEmptyState";
import { RemoveGateModal } from "~/features/gate/components/RemoveGateModal";
import { GateService } from "~/features/gate/service";
import { ParkingPositionService } from "~/features/parking-position/service";
import { TerminalService } from "~/features/terminal/service";
import { useApi } from "~/shared/api/useApi";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [gates, terminals, parkingPositions] = await Promise.all([
    new GateService().fetchAll(params.id),
    new TerminalService().fetchAll(params.id),
    new ParkingPositionService().fetchAll(params.id),
  ]);
  return { gates, terminals, parkingPositions };
}

export default function AirportGatesRoute({ params, loaderData }: Route.ComponentProps) {
  const { gates: initialGates, terminals, parkingPositions } = loaderData;
  const [gates, setGates] = useState<Gate[]>(initialGates);
  const [pendingRemove, setPendingRemove] = useState<Gate | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const { gateService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  useEffect(() => {
    setGates(initialGates);
  }, [initialGates]);

  const handleRemove = async (gate: Gate) => {
    setIsRemoving(true);
    try {
      await gateService.remove(params.id, gate.id);
      success(`Gate ${gate.name} deleted.`);
      setPendingRemove(null);
      revalidator.revalidate();
    } catch {
      error("Failed to delete gate.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      {gates.length === 0 ? (
        <GateListEmptyState airportId={params.id} hasTerminals={terminals.length > 0} />
      ) : (
        <div>
          <div className="flex justify-end mb-3">
            <Button as={Link} color="indigo" size="sm" className="space-x-1.5" to={`/airports/${params.id}/gates/new`}>
              <HiPlus />
              <span>Add gate</span>
            </Button>
          </div>
          <GateList
            airportId={params.id}
            gates={gates}
            terminals={terminals}
            parkingPositions={parkingPositions}
            onDelete={setPendingRemove}
          />
        </div>
      )}
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
