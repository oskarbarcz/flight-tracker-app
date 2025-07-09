"use client";

import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import FlightStatusSelector from "~/components/Tables/Selectors/FlightStatusSelector";
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
      <FlightStatusSelector />
    </ProtectedRoute>
  );
}
