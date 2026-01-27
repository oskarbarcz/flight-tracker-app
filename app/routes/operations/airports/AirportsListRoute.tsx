"use client";

import React, { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useSearchParams } from "react-router";
import AirportListTable from "~/components/airport/Table/AirportListTable";
import ContinentFilterTabs from "~/components/airport/Table/Tabs/ContinentFilterTabs";
import Container from "~/components/shared/Layout/Container";
import SectionHeaderWithLink from "~/components/shared/Section/SectionHeaderWithLink";
import { EmptyData } from "~/components/shared/Table/LoadingStates/EmptyData";
import { LoadingData } from "~/components/shared/Table/LoadingStates/LoadingData";
import { Airport, Continent, continentToDisplayName } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { useApi } from "~/state/contexts/content/api.context";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export default function AirportsListRoute() {
  usePageTitle("Airport list");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmptyResult, setIsEmptyResult] = useState<boolean>(false);
  const [airports, setAirports] = useState<Airport[]>([]);

  const { airportService } = useApi();
  const [searchParams] = useSearchParams();
  const currentContinent =
    (searchParams.get("continent") as Continent) ?? Continent.Europe;

  useEffect(() => {
    setIsLoading(true);
    setIsEmptyResult(false);
    airportService.getAllByContinent(currentContinent).then((airports) => {
      setIsLoading(false);
      setAirports(airports);
      setIsEmptyResult(airports.length === 0);
    });
  }, [airportService, currentContinent]);

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <SectionHeaderWithLink
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
      {isEmptyResult && (
        <EmptyData
          message={`No airports found in ${continentToDisplayName(currentContinent)} yet.`}
        />
      )}

      {!isLoading && !isEmptyResult && (
        <Container className="overflow-x-auto" padding="none">
          <AirportListTable airports={airports} />
        </Container>
      )}
    </ProtectedRoute>
  );
}
