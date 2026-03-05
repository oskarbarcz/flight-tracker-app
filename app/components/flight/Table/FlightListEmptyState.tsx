"use client";

import { Button } from "flowbite-react";
import React from "react";
import { FaCircleInfo, FaFileImport } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import { EmptyStateIcon } from "~/components/shared/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/components/shared/Table/LoadingStates/EmptyStateText";
import { TableEmptyState } from "~/components/shared/Table/LoadingStates/TableEmptyState";
import { FlightPhase } from "~/models";

type FlightListEmptyStateProps = {
  phase: FlightPhase;
  onImport: () => void;
  importLoading: boolean;
};

const messages = {
  [FlightPhase.Upcoming]: "No upcoming flights found.",
  [FlightPhase.Ongoing]: "No ongoing flights found.",
  [FlightPhase.Finished]: "No finished flights found.",
};

export default function FlightListEmptyState({
  phase,
  onImport,
  importLoading,
}: FlightListEmptyStateProps) {
  return (
    <TableEmptyState>
      <EmptyStateIcon icon={FaCircleInfo} color={"blue"} />
      <EmptyStateText title={messages[phase]} />
      {phase === FlightPhase.Upcoming && (
        <div className="flex flex-col justify-center sm:flex-row gap-3 mt-6">
          <Button
            className="dark:bg-gray-800 dark:hover:bg-gray-700"
            color="alternative"
            as={Link}
            to="/flights/new"
          >
            <HiPlus className="mr-2 h-5 w-5" />
            Create new
          </Button>
          <Button color="indigo" onClick={onImport} disabled={importLoading}>
            <FaFileImport className="mr-2 h-5 w-5" />
            Import from SimBrief
          </Button>
        </div>
      )}
    </TableEmptyState>
  );
}
