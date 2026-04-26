"use client";

import { Button } from "flowbite-react";
import React from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import { EmptyStateIcon } from "~/components/shared/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/components/shared/Table/LoadingStates/EmptyStateText";
import { TableEmptyState } from "~/components/shared/Table/LoadingStates/TableEmptyState";

type Props = {
  airportId: string;
  hasTerminals: boolean;
};

export function GateListEmptyState({ airportId, hasTerminals }: Props) {
  if (!hasTerminals) {
    return (
      <TableEmptyState>
        <EmptyStateIcon icon={FaCircleInfo} color="blue" />
        <EmptyStateText
          title="Define terminals first."
          paragraph="Gates must belong to a terminal. Add at least one terminal before creating gates."
        />
        <Button className="space-x-1.5 w-fit mx-auto" color="indigo" as={Link} to={`/airports/${airportId}/terminals`}>
          <HiPlus />
          <span>Manage terminals</span>
        </Button>
      </TableEmptyState>
    );
  }

  return (
    <TableEmptyState>
      <EmptyStateIcon icon={FaCircleInfo} color="blue" />
      <EmptyStateText
        title="No gates defined yet."
        paragraph="Add gates to record stand capabilities, boarding options, and noise restrictions."
      />
      <Button className="space-x-1.5 w-fit mx-auto" color="indigo" as={Link} to={`/airports/${airportId}/gates/new`}>
        <HiPlus />
        <span>Add gate</span>
      </Button>
    </TableEmptyState>
  );
}
