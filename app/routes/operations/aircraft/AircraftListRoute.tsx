"use client";

import React from "react";
import { useLoaderData } from "react-router";
import AircraftListTable from "~/components/aircraft/Table/AircraftListTable";
import Container from "~/components/shared/Layout/Container";
import SectionHeaderWithLink from "~/components/shared/Section/SectionHeaderWithLink";
import { Aircraft } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { AircraftService } from "~/state/api/aircraft.service";
import { usePageTitle } from "~/state/hooks/usePageTitle";

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
