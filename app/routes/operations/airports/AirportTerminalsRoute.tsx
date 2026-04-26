"use client";

import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportTerminalsRoute";
import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { Link, useRevalidator } from "react-router";
import { RemoveTerminalModal } from "~/components/airport/Terminal/RemoveTerminalModal";
import { TerminalList } from "~/components/airport/Terminal/TerminalList";
import { TerminalListEmptyState } from "~/components/airport/Terminal/TerminalListEmptyState";
import type { Terminal } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { TerminalService } from "~/state/api/terminal.service";
import { useToast } from "~/state/app/context/useToast";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const terminals = await new TerminalService().fetchAll(params.id);
  return { terminals };
}

export default function AirportTerminalsRoute({ params, loaderData }: Route.ComponentProps) {
  const { terminals: initialTerminals } = loaderData;
  const [terminals, setTerminals] = useState<Terminal[]>(initialTerminals);
  const [pendingRemove, setPendingRemove] = useState<Terminal | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const { terminalService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  useEffect(() => {
    setTerminals(initialTerminals);
  }, [initialTerminals]);

  const handleRemove = async (terminal: Terminal) => {
    setIsRemoving(true);
    try {
      await terminalService.remove(params.id, terminal.id);
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
      {terminals.length === 0 ? (
        <TerminalListEmptyState airportId={params.id} />
      ) : (
        <div>
          <div className="flex justify-end mb-3">
            <Button
              as={Link}
              color="indigo"
              size="sm"
              className="space-x-1.5"
              to={`/airports/${params.id}/terminals/new`}
            >
              <HiPlus />
              <span>Add terminal</span>
            </Button>
          </div>
          <TerminalList airportId={params.id} terminals={terminals} onDelete={setPendingRemove} />
        </div>
      )}
      {pendingRemove && (
        <RemoveTerminalModal
          terminal={pendingRemove}
          remove={handleRemove}
          cancel={() => setPendingRemove(null)}
          isPending={isRemoving}
        />
      )}
    </>
  );
}
