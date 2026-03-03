"use client";

import React from "react";
import { HiPlus } from "react-icons/hi";
import { useLoaderData } from "react-router";
import AircraftListTable from "~/components/aircraft/Table/AircraftListTable";
import Container from "~/components/shared/Layout/Container";
import SectionHeaderWithButton from "~/components/shared/Section/SectionHeaderWithButton";
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

  const aircraft = useLoaderData<typeof clientLoader>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <SectionHeaderWithButton
        sectionTitle="Aircrafts"
        primaryButton={{
          text: "Create new",
          url: "/aircraft/new",
          color: "indigo",
          icon: <HiPlus />,
        }}
      />
      <Container className="overflow-x-auto" padding="none">
        <AircraftListTable aircraft={aircraft} />
      </Container>
    </ProtectedRoute>
  );
}
