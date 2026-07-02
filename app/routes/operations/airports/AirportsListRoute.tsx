import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useSearchParams } from "react-router";
import { AirportListEmptyState } from "~/components/airport/Table/AirportListEmptyState";
import { AirportListTable } from "~/components/airport/Table/AirportListTable";
import { ContinentFilterTabs } from "~/components/airport/Table/Tabs/ContinentFilterTabs";
import { type Airport, Continent } from "~/models";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";
import { SectionHeaderWithButton } from "~/shared/ui/Section/SectionHeaderWithButton";
import { LoadingData } from "~/shared/ui/Table/LoadingStates/LoadingData";
import { useApi } from "~/state/api/context/useApi";
import { useDataRefresh } from "~/state/app/context/useDataRefresh";

export default function AirportsListRoute() {
  usePageTitle("Airport list");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmptyResult, setIsEmptyResult] = useState<boolean>(false);
  const [airports, setAirports] = useState<Airport[]>([]);

  const { airportService } = useApi();
  const { markRefreshed } = useDataRefresh();
  const [searchParams] = useSearchParams();
  const continent = (searchParams.get("continent") as Continent) ?? Continent.Europe;

  useEffect(() => {
    setIsLoading(true);
    setIsEmptyResult(false);
    airportService.fetchAll({ continent }).then((airports) => {
      setIsLoading(false);
      setAirports(airports);
      setIsEmptyResult(airports.length === 0);
      markRefreshed();
    });
  }, [airportService, continent, markRefreshed]);

  return (
    <>
      <SectionHeaderWithButton
        sectionTitle="Airports"
        primaryButton={{
          text: "Create new",
          url: "/airports/new",
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
    </>
  );
}
