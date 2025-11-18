"use client";

import React from "react";
import FlightStatusTabs from "~/components/flight/Table/Tabs/FlightStatusTabs";
import SectionHeaderWithLink from "~/components/shared/Section/SectionHeaderWithLink";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { usePageTitle } from "~/state/hooks/usePageTitle";

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
