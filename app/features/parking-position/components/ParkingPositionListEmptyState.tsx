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

export function ParkingPositionListEmptyState({ airportId, hasTerminals }: Props) {
  if (!hasTerminals) {
    return (
      <TableEmptyState>
        <EmptyStateIcon icon={FaCircleInfo} color="blue" />
        <EmptyStateText
          title="Define terminals first."
          paragraph="Parking positions must belong to a terminal. Add at least one terminal before creating parking positions."
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
        title="No parking positions defined yet."
        paragraph="Add parking positions to record stand capabilities, boarding options, and noise restrictions."
      />
      <Button
        className="space-x-1.5 w-fit mx-auto"
        color="indigo"
        as={Link}
        to={`/airports/${airportId}/parking-positions/new`}
      >
        <HiPlus />
        <span>Add parking position</span>
      </Button>
    </TableEmptyState>
  );
}
