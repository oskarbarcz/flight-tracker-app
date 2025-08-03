"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import { Airport, Continent } from "~/models";
import { useSearchParams } from "react-router";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import AirportListTable from "~/components/Tables/AirportListTable";
import Container from "~/components/Layout/Container";
import ContinentFilterTabs from "~/components/Tabs/ContinentFilterTabs";
import { useApi } from "~/state/contexts/api.context";
import { LoadingData } from "~/components/Tables/LoadingStates/LoadingData";
import { EmptyData } from "~/components/Tables/LoadingStates/EmptyData";
import { capitalize } from "~/functions/text";

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
        linkText="Create new"
        linkUrl="/airports/new"
      />

      <ContinentFilterTabs />

      {isLoading && <LoadingData />}
      {isEmptyResult && (
        <EmptyData
          message={`No airports found in ${capitalize(currentContinent)} yet.`}
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
