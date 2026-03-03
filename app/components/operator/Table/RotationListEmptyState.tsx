"use client";

import { Button } from "flowbite-react";
import React, { JSX } from "react";
import { FaCircleInfo, FaFileImport } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import TableEmptyState from "~/components/shared/Table/LoadingStates/TableEmptyState";
import { FlightPhase } from "~/models";

type Props = {
  operatorId: string;
};

export function RotationListEmptyState({ operatorId }: Props): JSX.Element {
  return (
    <TableEmptyState>
      <div className="flex items-center justify-center">
        <FaCircleInfo className="inline mr-3" />
        There are no rotations yet.
      </div>
      <div className="flex flex-col justify-center sm:flex-row gap-3 mt-6">
        <Button
          className="dark:bg-gray-800 dark:hover:bg-gray-700"
          color="indigo"
          as={Link}
          to={`/operator/${operatorId}/rotations/new`}
        >
          <HiPlus className="mr-2 h-5 w-5" />
          Create new
        </Button>
      </div>
    </TableEmptyState>
  );
}
