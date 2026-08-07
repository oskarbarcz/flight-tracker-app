import type { Route } from ".react-router/types/app/routes/pilot/airports/+types/AirportPreviewLayout";
import React, { useCallback, useMemo, useState } from "react";
import { LuChevronLeft } from "react-icons/lu";
import { Link, Outlet, useLoaderData, useLocation } from "react-router";
import type { AirportWeather } from "~/features/airport";
import { AirportHeadline } from "~/features/airport/components/Header/AirportHeadline";
import { AirportWeatherPanel } from "~/features/airport/components/Library/AirportWeatherPanel";
import type { AirportPreviewContext } from "~/features/airport/components/Library/airportPreviewContext";
import { AirportSectionTabs } from "~/features/airport/components/Management/AirportSectionTabs";
import { filterAirportSection } from "~/features/airport/components/Management/airportSectionFilters";
import {
  AIRPORT_LIBRARY_BASE,
  resolveActiveSection,
  sectionMapTitle,
} from "~/features/airport/components/Management/airportSections";
import { AirportLocationMap } from "~/features/airport/components/Overview/AirportLocationMap";
import { AirportService } from "~/features/airport/service";
import { GateService } from "~/features/gate/service";
import { ParkingPositionService } from "~/features/parking-position/service";
import { RunwayService } from "~/features/runway/service";
import { TerminalService } from "~/features/terminal/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { FilterInput } from "~/shared/ui/Filter/FilterInput";

const EMPTY_WEATHER: AirportWeather = {
  metar: null,
  metarLastUpdate: null,
  taf: null,
  tafLastUpdate: null,
  watch: false,
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [airport, runways, terminals, parkingPositions, gates, weather] = await Promise.all([
    new AirportService().fetchById(params.id),
    new RunwayService().fetchAll(params.id),
    new TerminalService().fetchAll(params.id),
    new ParkingPositionService().fetchAll(params.id),
    new GateService().fetchAll(params.id),
    new AirportService().fetchWeather(params.id).catch(() => EMPTY_WEATHER),
  ]);
  return { data: { airport, runways, terminals, parkingPositions, gates }, weather };
}

export default function AirportPreviewLayout() {
  const { data, weather } = useLoaderData<typeof clientLoader>();
  const { pathname } = useLocation();
  usePageTitle(`${data.airport.iataCode} | Airports library`);

  const section = resolveActiveSection(pathname);
  const [draft, setDraft] = useState({ section: section.key, filter: "" });
  const filter = draft.section === section.key ? draft.filter : "";
  const setFilter = (value: string) => setDraft({ section: section.key, filter: value });
  const clearFilter = useCallback(() => setDraft((previous) => ({ ...previous, filter: "" })), []);

  const visible = useMemo(() => filterAirportSection(section, data, filter), [section, data, filter]);
  const context: AirportPreviewContext = { ...visible, isFiltered: filter !== "", clearFilter };

  return (
    <div className="space-y-6">
      <Link
        to="/airports-library"
        viewTransition
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
      >
        <LuChevronLeft size={16} />
        Airports library
      </Link>

      <AirportHeadline airport={data.airport} readOnly />

      <AirportWeatherPanel weather={weather} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0 space-y-4">
          <AirportSectionTabs basePath={AIRPORT_LIBRARY_BASE} airportId={data.airport.id} activeSection={section} />
          {data[section.key].length > 0 && (
            <div className="w-full sm:max-w-xs">
              <FilterInput value={filter} onChange={setFilter} placeholder={section.filterPlaceholder} />
            </div>
          )}
          <Outlet context={context} />
        </div>

        <div className="h-80 lg:sticky lg:top-0 lg:h-[36rem]">
          <AirportLocationMap
            airport={visible.airport}
            runways={visible.runways}
            terminals={visible.terminals}
            parkingPositions={visible.parkingPositions}
            gates={visible.gates}
            visibleLayers={section.layers}
            title={sectionMapTitle(section)}
          />
        </div>
      </div>
    </div>
  );
}
