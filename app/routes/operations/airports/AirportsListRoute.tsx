import React, { useCallback, useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { Outlet, useSearchParams } from "react-router";
import { useDataRefresh } from "~/app-state/useDataRefresh";
import { type Airport, Continent } from "~/features/airport";
import { AirportListEmptyState } from "~/features/airport/components/Table/AirportListEmptyState";
import { AirportListTable } from "~/features/airport/components/Table/AirportListTable";
import { type AirportListContext, createAirportPath } from "~/features/airport/components/Table/airportListContext";
import { ContinentFilterTabs } from "~/features/airport/components/Table/Tabs/ContinentFilterTabs";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";
import { SectionHeaderWithButton } from "~/shared/ui/Section/SectionHeaderWithButton";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";

export default function AirportsListRoute() {
  usePageTitle("Airport list");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [airports, setAirports] = useState<Airport[]>([]);

  const { airportService } = useApi();
  const { markRefreshed } = useDataRefresh();
  const [searchParams] = useSearchParams();
  const continent = (searchParams.get("continent") as Continent) ?? Continent.Europe;

  const reload = useCallback(async () => {
    setIsLoading(true);
    const fetched = await airportService.fetchAll({ continent });
    setAirports(fetched);
    setIsLoading(false);
    markRefreshed();
  }, [airportService, continent, markRefreshed]);

  useEffect(() => {
    reload();
  }, [reload]);

  const isEmptyResult = !isLoading && airports.length === 0;
  const context: AirportListContext = { continent, reload };

  return (
    <>
      <SectionHeaderWithButton
        sectionTitle="Airports"
        primaryButton={{
          text: "Create new",
          url: createAirportPath(continent),
          color: "indigo",
          icon: <HiPlus />,
        }}
      />

      <ContinentFilterTabs />

      {isLoading && <LoadingData />}
      {isEmptyResult && <AirportListEmptyState continent={continent} />}

      {!isLoading && !isEmptyResult && (
        <TransparentContainer className="overflow-x-auto">
          <AirportListTable airports={airports} />
        </TransparentContainer>
      )}

      <Outlet context={context} />
    </>
  );
}
