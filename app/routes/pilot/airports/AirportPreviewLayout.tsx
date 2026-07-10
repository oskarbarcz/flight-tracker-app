import type { Route } from ".react-router/types/app/routes/pilot/airports/+types/AirportPreviewLayout";
import React from "react";
import { LuChevronLeft } from "react-icons/lu";
import { Link, Outlet, useLoaderData, useLocation } from "react-router";
import { AirportHeader } from "~/features/airport/components/Header/AirportHeader";
import { AirportPreviewTabs } from "~/features/airport/components/Library/AirportPreviewTabs";
import type { AirportPreviewContext } from "~/features/airport/components/Library/airportPreviewContext";
import { resolveActiveTab } from "~/features/airport/components/Library/previewTabs";
import { AirportLocationMap } from "~/features/airport/components/Overview/AirportLocationMap";
import { AirportService } from "~/features/airport/service";
import { GateService } from "~/features/gate/service";
import { ParkingPositionService } from "~/features/parking-position/service";
import { RunwayService } from "~/features/runway/service";
import { TerminalService } from "~/features/terminal/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

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

export default function AirportPreviewLayout() {
  const { airport, runways, terminals, parkingPositions, gates } = useLoaderData<typeof clientLoader>();
  const { pathname } = useLocation();
  usePageTitle(`${airport.iataCode} | Airports library`);

  const activeTab = resolveActiveTab(pathname, airport.id);
  const context: AirportPreviewContext = { airport, runways, terminals, parkingPositions, gates };

  return (
    <div className="space-y-3">
      <Link
        to="/airports-library"
        viewTransition
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
      >
        <LuChevronLeft size={16} />
        Airports library
      </Link>

      <AirportHeader airport={airport} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <div className="h-80 lg:sticky lg:top-0 lg:h-[36rem]">
          <AirportLocationMap
            airport={airport}
            runways={runways}
            terminals={terminals}
            parkingPositions={parkingPositions}
            gates={gates}
            visibleLayers={activeTab.layers}
          />
        </div>

        <div className="min-w-0">
          <AirportPreviewTabs airportId={airport.id} />
          <div className="mt-6">
            <Outlet context={context} />
          </div>
        </div>
      </div>
    </div>
  );
}
