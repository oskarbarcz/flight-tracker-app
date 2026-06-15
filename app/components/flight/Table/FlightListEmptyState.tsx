"use client";

import { Button } from "flowbite-react";
import React from "react";
import { FaCircleInfo, FaFileImport } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import { EmptyStateIcon } from "~/components/shared/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/components/shared/Table/LoadingStates/EmptyStateText";
import { TableEmptyState } from "~/components/shared/Table/LoadingStates/TableEmptyState";

type FlightListEmptyStateProps = {
  message: string;
  showImportActions?: boolean;
  onImport?: () => void;
  importLoading?: boolean;
};

export function FlightListEmptyState({
  message,
  showImportActions = false,
  onImport,
  importLoading = false,
}: FlightListEmptyStateProps) {
  return (
    <TableEmptyState>
      <EmptyStateIcon icon={FaCircleInfo} color={"blue"} />
      <EmptyStateText title={message} />
      {showImportActions && (
        <div className="flex flex-col justify-center sm:flex-row gap-3 mt-6">
          <Button className="dark:bg-gray-800 dark:hover:bg-gray-700" color="alternative" as={Link} to="/flights/new">
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
