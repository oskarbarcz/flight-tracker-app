"use client";

import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useSearchParams } from "react-router";
import AirportListEmptyState from "~/components/airport/Table/AirportListEmptyState";
import AirportListTable from "~/components/airport/Table/AirportListTable";
import ContinentFilterTabs from "~/components/airport/Table/Tabs/ContinentFilterTabs";
import Container from "~/components/shared/Layout/Container";
import SectionHeaderWithButton from "~/components/shared/Section/SectionHeaderWithButton";
import { LoadingData } from "~/components/shared/Table/LoadingStates/LoadingData";
import { type Airport, Continent } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

export default function AirportsListRoute() {
  usePageTitle("Airport list");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmptyResult, setIsEmptyResult] = useState<boolean>(false);
  const [airports, setAirports] = useState<Airport[]>([]);

  const { airportService } = useApi();
  const [searchParams] = useSearchParams();
  const continent = (searchParams.get("continent") as Continent) ?? Continent.Europe;

  useEffect(() => {
    setIsLoading(true);
    setIsEmptyResult(false);
    airportService.fetchAll({ continent }).then((airports) => {
      setIsLoading(false);
      setAirports(airports);
      setIsEmptyResult(airports.length === 0);
    });
  }, [airportService, continent]);

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
        <Container className="overflow-x-auto" padding="none">
          <AirportListTable airports={airports} />
        </Container>
      )}
    </>
  );
}
