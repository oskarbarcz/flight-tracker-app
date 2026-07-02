import { Button } from "flowbite-react";
import React, { useState } from "react";
import { FaFileImport } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { Link, useNavigate } from "react-router";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";
import { useApi } from "~/state/api/context/useApi";
import { useToast } from "~/state/app/context/useToast";

export function PlanFlightOptions() {
  const { flightService } = useApi();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    setImporting(true);
    try {
      const flight = await flightService.importFlightFromSimbrief();
      success(`Flight ${flight.flightNumber} imported from SimBrief`);
      navigate(`/flights/${flight.id}/overview`);
    } catch (err) {
      console.error("Failed to import flight from SimBrief", err);
      error("Failed to import flight from SimBrief");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="mb-4 grid gap-4 lg:grid-cols-2">
      <Container>
        <ContainerTitle icon={FaFileImport} title="Import from SimBrief" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Pull your latest SimBrief OFP to pre-fill the flight number, route, schedule and aircraft. You can review
          everything before the plan goes live.
        </p>
        <Button className="mt-auto w-full sm:w-fit" color="indigo" onClick={handleImport} disabled={importing}>
          <FaFileImport className="mr-2 h-5 w-5" />
          Import from SimBrief
        </Button>
      </Container>
      <Container>
        <ContainerTitle icon={HiPlus} title="Create manually" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter the flight number, schedule, route and aircraft by hand — best when you're not starting from a SimBrief
          plan.
        </p>
        <Button
          as={Link}
          to="/flights/new"
          className="mt-auto w-full sm:w-fit dark:bg-gray-800 dark:hover:bg-gray-700"
          color="alternative"
        >
          <HiPlus className="mr-2 h-5 w-5" />
          Create new
        </Button>
      </Container>
    </div>
  );
}
