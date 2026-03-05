"use client";

import { Button } from "flowbite-react";
import React from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import { EmptyStateIcon } from "~/components/shared/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/components/shared/Table/LoadingStates/EmptyStateText";
import { TableEmptyState } from "~/components/shared/Table/LoadingStates/TableEmptyState";
import { Continent, continentToDisplayName } from "~/models";

type Props = {
  continent: Continent;
};

export default function AirportListEmptyState({ continent }: Props) {
  return (
    <TableEmptyState>
      <EmptyStateIcon icon={FaCircleInfo} color={"blue"} />
      <EmptyStateText
        title={`No airports available in ${continentToDisplayName(continent)} yet.`}
      />
      <Button
        className="space-x-1.5 w-fit mx-auto"
        color="indigo"
        as={Link}
        to="/airports/new"
      >
        <HiPlus />
        <span>Add airport</span>
      </Button>
    </TableEmptyState>
  );
}
