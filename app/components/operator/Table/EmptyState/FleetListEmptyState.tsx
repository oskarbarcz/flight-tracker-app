"use client";

import { Button } from "flowbite-react";
import React, { JSX } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import TableEmptyState from "~/components/shared/Table/LoadingStates/TableEmptyState";

type Props = {
  operatorId: string;
};

export function FleetListEmptyState({ operatorId }: Props): JSX.Element {
  return (
    <TableEmptyState>
      <div className="flex items-center justify-center">
        <FaCircleInfo className="inline mr-3" />
        There are no aircrafts yet.
      </div>
      <div className="flex flex-col justify-center sm:flex-row gap-3 mt-6">
        <Button
          className="dark:bg-gray-800 dark:hover:bg-gray-700"
          color="indigo"
          as={Link}
          to={`/operators/${operatorId}/aircraft/add`}
        >
          <HiPlus className="mr-2 h-5 w-5" />
          Add new
        </Button>
      </div>
    </TableEmptyState>
  );
}
