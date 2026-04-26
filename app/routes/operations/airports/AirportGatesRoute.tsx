"use client";

import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportGatesRoute";
import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { Link, useRevalidator } from "react-router";
import { GateList } from "~/components/airport/Gate/GateList";
import { GateListEmptyState } from "~/components/airport/Gate/GateListEmptyState";
import { RemoveGateModal } from "~/components/airport/Gate/RemoveGateModal";
import type { Gate } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { GateService } from "~/state/api/gate.service";
import { TerminalService } from "~/state/api/terminal.service";
import { useToast } from "~/state/app/context/useToast";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [gates, terminals] = await Promise.all([
    new GateService().fetchAll(params.id),
    new TerminalService().fetchAll(params.id),
  ]);
  return { gates, terminals };
}

export default function AirportGatesRoute({ params, loaderData }: Route.ComponentProps) {
  const { gates: initialGates, terminals } = loaderData;
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
          <GateList airportId={params.id} gates={gates} terminals={terminals} onDelete={setPendingRemove} />
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
