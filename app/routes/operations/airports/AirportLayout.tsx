import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportLayout";
import React, { useMemo, useState } from "react";
import { Outlet, useLoaderData, useLocation, useNavigate, useSearchParams } from "react-router";
import { EnrichAirportDataModal } from "~/features/airport/components/Enrichment/EnrichAirportDataModal";
import { UpdateAirportModal } from "~/features/airport/components/Forms/UpdateAirportModal";
import { AirportHeadline } from "~/features/airport/components/Header/AirportHeadline";
import { AirportSectionTabs } from "~/features/airport/components/Management/AirportSectionTabs";
import { AirportSectionToolbar } from "~/features/airport/components/Management/AirportSectionToolbar";
import {
  type AirportManagementContext,
  sectionItemCount,
} from "~/features/airport/components/Management/airportManagementContext";
import { filterAirportSection } from "~/features/airport/components/Management/airportSectionFilters";
import {
  AIRPORT_MANAGEMENT_BASE,
  isAirportEditRequested,
  isAirportEnrichRequested,
  resolveActiveSection,
  sectionMapTitle,
} from "~/features/airport/components/Management/airportSections";
import { AirportLocationMap } from "~/features/airport/components/Overview/AirportLocationMap";
import { AirportService } from "~/features/airport/service";
import { GateService } from "~/features/gate/service";
import type { Notam } from "~/features/notam";
import { NotamsImportedAt } from "~/features/notam/components/NotamsImportedAt";
import { ParkingPositionService } from "~/features/parking-position/service";
import { RunwayService } from "~/features/runway/service";
import { TerminalService } from "~/features/terminal/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { Breadcrumbs } from "~/shared/ui/Section/Breadcrumbs";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [airport, runways, terminals, parkingPositions, gates, notams] = await Promise.all([
    new AirportService().fetchById(params.id),
    new RunwayService().fetchAll(params.id),
    new TerminalService().fetchAll(params.id),
    new ParkingPositionService().fetchAll(params.id),
    new GateService().fetchAll(params.id),
    new AirportService().fetchNotams(params.id).catch((): Notam[] | null => null),
  ]);
  return { airport, runways, terminals, parkingPositions, gates, notams };
}

export default function AirportLayout() {
  const data = useLoaderData<typeof clientLoader>();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  usePageTitle(`${data.airport.iataCode} | Airport`);

  const section = resolveActiveSection(pathname);
  const [draft, setDraft] = useState({ section: section.key, filter: "" });
  const filter = draft.section === section.key ? draft.filter : "";
  const setFilter = (value: string) => setDraft({ section: section.key, filter: value });

  const visible = useMemo(() => filterAirportSection(section, data, filter), [section, data, filter]);
  const context: AirportManagementContext = {
    ...visible,
    isFiltered: filter !== "",
    clearFilter: () => setFilter(""),
  };

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          className="mb-4"
          items={[
            { label: "Airports", to: AIRPORT_MANAGEMENT_BASE },
            { label: data.airport.icaoCode, mono: true },
          ]}
        />
        <AirportHeadline airport={data.airport} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0 space-y-4">
          <AirportSectionTabs
            basePath={AIRPORT_MANAGEMENT_BASE}
            airportId={data.airport.id}
            activeSection={section}
            counts={{ notams: data.notams?.length }}
          />
          {sectionItemCount(section, data) > 0 && (
            <AirportSectionToolbar
              airportId={data.airport.id}
              section={section}
              filter={filter}
              onFilterChange={setFilter}
              meta={section.key === "notams" ? <NotamsImportedAt notams={data.notams} /> : undefined}
            />
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

      {isAirportEditRequested(searchParams) && (
        <UpdateAirportModal airport={data.airport} close={() => navigate(pathname)} />
      )}

      {isAirportEnrichRequested(searchParams) && (
        <EnrichAirportDataModal airport={data.airport} close={() => navigate(pathname)} />
      )}
    </div>
  );
}
