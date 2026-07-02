import { Button } from "flowbite-react";
import React from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import { EmptyStateIcon } from "~/shared/ui/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/shared/ui/Table/LoadingStates/EmptyStateText";
import { TableEmptyState } from "~/shared/ui/Table/LoadingStates/TableEmptyState";

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
        paragraph="Add boarding gates and link each one to the parking position it serves."
      />
      <Button className="space-x-1.5 w-fit mx-auto" color="indigo" as={Link} to={`/airports/${airportId}/gates/new`}>
        <HiPlus />
        <span>Add gate</span>
      </Button>
    </TableEmptyState>
  );
}
