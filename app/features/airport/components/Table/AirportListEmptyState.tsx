import { Button } from "flowbite-react";
import React from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import type { Continent } from "~/features/airport";
import { toHuman } from "~/i18n/translate";
import { EmptyStateIcon } from "~/shared/ui/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/shared/ui/Table/LoadingStates/EmptyStateText";
import { TableEmptyState } from "~/shared/ui/Table/LoadingStates/TableEmptyState";

type Props = {
  continent: Continent;
};

export function AirportListEmptyState({ continent }: Props) {
  return (
    <TableEmptyState>
      <EmptyStateIcon icon={FaCircleInfo} color={"blue"} />
      <EmptyStateText title={`No airports available in ${toHuman.airport.continent(continent)} yet.`} />
      <Button className="space-x-1.5 w-fit mx-auto" color="indigo" as={Link} to="/airports/new">
        <HiPlus />
        <span>Add airport</span>
      </Button>
    </TableEmptyState>
  );
}
