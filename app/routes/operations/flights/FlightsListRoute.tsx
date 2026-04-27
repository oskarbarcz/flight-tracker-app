"use client";

import React, { useState } from "react";
import { FaFileImport } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { useNavigate, useSearchParams } from "react-router";
import { FlightListEmptyState } from "~/components/flight/Table/FlightListEmptyState";
import { FlightListTable } from "~/components/flight/Table/FlightListTable";
import { FlightStatusTabs } from "~/components/flight/Table/Tabs/FlightStatusTabs";
import { Container } from "~/components/shared/Layout/Container";
import { SectionHeaderWithButton } from "~/components/shared/Section/SectionHeaderWithButton";
import { FlightPhase } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { FlightListProvider, useFlightList } from "~/state/api/context/useFlightList";
import { useToast } from "~/state/app/context/useToast";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

function FlightsListContent() {
  const { flightService } = useApi();
  const navigate = useNavigate();
  const { flights, loading: listLoading, reloadFlights } = useFlightList();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const currentPhase = (searchParams.get("phase") as FlightPhase) ?? FlightPhase.Upcoming;
  const currentPage = Number.parseInt(searchParams.get("page") ?? "1", 10);

  React.useEffect(() => {
    reloadFlights(currentPhase, currentPage);
  }, [reloadFlights, currentPhase, currentPage]);

  const handleImport = async () => {
    setLoading(true);
    try {
      const flight = await flightService.importFlightFromSimbrief();
      success(`Flight ${flight.flightNumber} imported from SimBrief`);
      navigate(`/flights/${flight.id}/overview`);
    } catch (err) {
      console.error("Failed to import flight from SimBrief", err);
      error("Failed to import flight from SimBrief");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SectionHeaderWithButton
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
      {flights.length === 0 && !listLoading ? (
        <FlightListEmptyState phase={currentPhase} onImport={handleImport} importLoading={loading} />
      ) : (
        <Container padding="none">
          <FlightListTable phase={currentPhase} />
        </Container>
      )}
    </>
  );
}

export default function FlightsListRoute() {
  usePageTitle("Flight plans");

  return (
    <FlightListProvider>
      <FlightsListContent />
    </FlightListProvider>
  );
}
