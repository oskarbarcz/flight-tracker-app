"use client";

import SectionHeaderWithLink from "~/components/shared/Section/SectionHeaderWithLink";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import FlightStatusTabs from "~/components/flight/Table/Tabs/FlightStatusTabs";
import React from "react";

export default function FlightsListRoute() {
  usePageTitle("Flight plans");

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <SectionHeaderWithLink
        sectionTitle="Flights"
        linkText="Create new"
        linkUrl="/flights/new"
      />
      <FlightStatusTabs />
    </ProtectedRoute>
  );
}
