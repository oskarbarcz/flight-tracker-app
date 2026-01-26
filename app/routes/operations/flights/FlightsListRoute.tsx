"use client";

import React, { useState } from "react";
import { FaFileImport } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import FlightStatusTabs from "~/components/flight/Table/Tabs/FlightStatusTabs";
import SectionHeaderWithLink from "~/components/shared/Section/SectionHeaderWithLink";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { useApi } from "~/state/contexts/content/api.context";
import {
  FlightListProvider,
  useFlightList,
} from "~/state/contexts/content/flight-list.context";
import { useToast } from "~/state/contexts/global/toast.context";
import { usePageTitle } from "~/state/hooks/usePageTitle";

function FlightsListContent() {
  const { flightService } = useApi();
  const { refreshFlights } = useFlightList();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    try {
      const flight = await flightService.importFlightFromSimbrief();
      await refreshFlights();
      success(`Flight ${flight.flightNumber} imported from Simbrief`);
    } catch (err) {
      console.error("Failed to import flight from Simbrief", err);
      error("Failed to import flight from Simbrief");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SectionHeaderWithLink
        sectionTitle="Flight plans"
        primaryButton={{
          text: "Import from Simbrief",
          onClick: handleImport,
          disabled: loading,
          color: "indigo",
          icon: <FaFileImport />,
        }}
        secondaryButton={{
          text: "Create new",
          url: "/flights/new",
          color: "alternative",
          icon: <HiPlus />,
        }}
      />
      <FlightStatusTabs />
    </>
  );
}

export default function FlightsListRoute() {
  usePageTitle("Flight plans");

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <FlightListProvider>
        <FlightsListContent />
      </FlightListProvider>
    </ProtectedRoute>
  );
}
