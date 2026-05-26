"use client";

import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportRunwaysRoute";
import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { Link, useRevalidator } from "react-router";
import { AirportRunwaysMap } from "~/components/airport/Runway/AirportRunwaysMap";
import { RemoveRunwayModal } from "~/components/airport/Runway/RemoveRunwayModal";
import { RunwayList } from "~/components/airport/Runway/RunwayList";
import { RunwayListEmptyState } from "~/components/airport/Runway/RunwayListEmptyState";
import type { Runway } from "~/models";
import { AirportService } from "~/state/api/airport.service";
import { useApi } from "~/state/api/context/useApi";
import { GateService } from "~/state/api/gate.service";
import { RunwayService } from "~/state/api/runway.service";
import { TerminalService } from "~/state/api/terminal.service";
import { useToast } from "~/state/app/context/useToast";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [airport, runways, terminals, gates] = await Promise.all([
    new AirportService().fetchById(params.id),
    new RunwayService().fetchAll(params.id),
    new TerminalService().fetchAll(params.id),
    new GateService().fetchAll(params.id),
  ]);
  return { airport, runways, terminals, gates };
}

export default function AirportRunwaysRoute({ params, loaderData }: Route.ComponentProps) {
  const { airport, runways: initialRunways, terminals, gates } = loaderData;
  const [runways, setRunways] = useState<Runway[]>(initialRunways);
  const [pendingRemove, setPendingRemove] = useState<Runway | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const { runwayService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  useEffect(() => {
    setRunways(initialRunways);
  }, [initialRunways]);

  const handleRemove = async (runway: Runway) => {
    setIsRemoving(true);
    try {
      await runwayService.remove(params.id, runway.id);
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
      {runways.length === 0 ? (
        <RunwayListEmptyState airportId={params.id} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3">
          <div className="h-[400px] lg:h-full lg:min-h-[400px]">
            <AirportRunwaysMap
              airport={airport}
              runways={runways}
              terminals={terminals}
              gates={gates}
              fallbackCenter={airport.location}
            />
          </div>
          <div>
            <div className="flex justify-end mb-3">
              <Button
                as={Link}
                color="indigo"
                size="sm"
                className="space-x-1.5"
                to={`/airports/${params.id}/runways/new`}
              >
                <HiPlus />
                <span>Add runway</span>
              </Button>
            </div>
            <RunwayList airportId={params.id} runways={runways} onDelete={setPendingRemove} />
          </div>
        </div>
      )}
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
