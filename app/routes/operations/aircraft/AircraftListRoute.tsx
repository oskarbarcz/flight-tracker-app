"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import { Aircraft } from "~/models";
import { useLoaderData } from "react-router";
import { AircraftService } from "~/state/api/aircraft.service";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import Container from "~/components/Layout/Container";
import AircraftListTable from "~/components/Tables/AircraftListTable";

export async function clientLoader(): Promise<Aircraft[]> {
  return new AircraftService().fetchAll();
}

export default function AircraftListRoute() {
  usePageTitle("Aircraft list");

  const aircrafts = useLoaderData<Aircraft[]>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <SectionHeaderWithLink
        sectionTitle="Aircrafts"
        linkText="Create new"
        linkUrl="/aircraft/new"
      />
      <Container className="overflow-x-auto" padding="none">
        <AircraftListTable aircraft={aircrafts} />
      </Container>
    </ProtectedRoute>
  );
}
