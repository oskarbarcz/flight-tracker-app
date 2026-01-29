"use client";

import React, { useState } from "react";
import { FaFileImport } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { useNavigate, useSearchParams } from "react-router";
import FlightListTable from "~/components/flight/Table/FlightListTable";
import FlightStatusTabs from "~/components/flight/Table/Tabs/FlightStatusTabs";
import Container from "~/components/shared/Layout/Container";
import SectionHeaderWithLink from "~/components/shared/Section/SectionHeaderWithLink";
import { FlightPhase } from "~/models";
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
  const navigate = useNavigate();
  const { reloadFlights, setPage } = useFlightList();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const currentPhase =
    (searchParams.get("phase") as FlightPhase) ?? FlightPhase.Upcoming;

  const handleImport = async () => {
    setLoading(true);
    try {
      const flight = await flightService.importFlightFromSimbrief();
      setPage(1);
      reloadFlights(FlightPhase.Upcoming, 1);
      navigate(`/flights?id=${flight.id}&phase=upcoming`);
      success(`Flight ${flight.flightNumber} imported from SimBrief`);
    } catch (err) {
      console.error("Failed to import flight from SimBrief", err);
      error("Failed to import flight from SimBrief");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SectionHeaderWithLink
        sectionTitle="Flight plans"
        primaryButton={{
          text: "Import from SimBrief",
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
      <Container padding="none">
        <FlightListTable phase={currentPhase} />
      </Container>
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
