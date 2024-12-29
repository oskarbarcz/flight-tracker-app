"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink/SectionHeaderWithLink";

export default function AirportsListRoute() {
  return (
    <ProtectedRoute expectedRole={"operations"}>
      <SectionHeaderWithLink
        sectionTitle="Airports"
        linkText="Create new"
        linkUrl="/airports/new"
      />
    </ProtectedRoute>
  );
}
