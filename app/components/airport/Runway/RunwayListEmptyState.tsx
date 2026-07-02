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
};

export function RunwayListEmptyState({ airportId }: Props) {
  return (
    <TableEmptyState>
      <EmptyStateIcon icon={FaCircleInfo} color="blue" />
      <EmptyStateText
        title="No runways defined yet."
        paragraph="Add the airport's runways to enable flight planning, taxi routing, and runway assignments."
      />
      <Button className="space-x-1.5 w-fit mx-auto" color="indigo" as={Link} to={`/airports/${airportId}/runways/new`}>
        <HiPlus />
        <span>Add runway</span>
      </Button>
    </TableEmptyState>
  );
}
