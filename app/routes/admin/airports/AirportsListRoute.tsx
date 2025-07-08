"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import { Airport } from "~/models";
import { useLoaderData } from "react-router";
import { AirportService } from "~/state/api/airport.service";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import AirportListTable from "~/components/Tables/AirportListTable";
import Container from "~/components/Container";

export async function clientLoader(): Promise<Airport[]> {
  return new AirportService().getAll();
}

export default function AirportsListRoute() {
  usePageTitle("Airport list");

  const airports = useLoaderData<Airport[]>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <SectionHeaderWithLink
        sectionTitle="Airports"
        linkText="Create new"
        linkUrl="/airports/new"
      />
      <Container className="overflow-x-auto" noPadding>
        <AirportListTable airports={airports} />
      </Container>
    </ProtectedRoute>
  );
}
