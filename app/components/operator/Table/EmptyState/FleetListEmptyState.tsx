"use client";

import { Button } from "flowbite-react";
import React, { JSX } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import { EmptyStateIcon } from "~/components/shared/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/components/shared/Table/LoadingStates/EmptyStateText";
import { TableEmptyState } from "~/components/shared/Table/LoadingStates/TableEmptyState";

type Props = {
  operatorId: string;
};

export function FleetListEmptyState({ operatorId }: Props): JSX.Element {
  return (
    <TableEmptyState>
      <EmptyStateIcon icon={FaCircleInfo} color={"blue"} />
      <EmptyStateText
        title="There are no aircrafts yet."
        paragraph="Add first aircraft to your fleet to unlock flight planning, scheduling, and dispatch tools."
      />
      <Button
        className="space-x-1.5 w-fit mx-auto"
        color="indigo"
        as={Link}
        to={`/operators/${operatorId}/aircraft/new`}
      >
        <HiPlus />
        <span>Add aircraft</span>
      </Button>
    </TableEmptyState>
  );
}
