import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportOverviewRoute";
import React from "react";
import { useLoaderData } from "react-router";
import { AirportDetailsCard } from "~/features/airport/components/Overview/AirportDetailsCard";
import { AirportLocationMap } from "~/features/airport/components/Overview/AirportLocationMap";
import { AirportService } from "~/features/airport/service";
import { GateService } from "~/features/gate/service";
import { ParkingPositionService } from "~/features/parking-position/service";
import { RunwayService } from "~/features/runway/service";
import { TerminalService } from "~/features/terminal/service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [airport, runways, terminals, parkingPositions, gates] = await Promise.all([
    new AirportService().fetchById(params.id),
    new RunwayService().fetchAll(params.id),
    new TerminalService().fetchAll(params.id),
    new ParkingPositionService().fetchAll(params.id),
    new GateService().fetchAll(params.id),
  ]);
  return { airport, runways, terminals, parkingPositions, gates };
}

export default function AirportOverviewRoute() {
  const { airport, runways, terminals, parkingPositions, gates } = useLoaderData<typeof clientLoader>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
      <AirportDetailsCard airport={airport} />
      <AirportLocationMap
        airport={airport}
        runways={runways}
        terminals={terminals}
        parkingPositions={parkingPositions}
        gates={gates}
      />
    </div>
  );
}
