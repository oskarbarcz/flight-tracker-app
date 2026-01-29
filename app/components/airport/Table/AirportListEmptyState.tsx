"use client";

import React from "react";
import { FaCircleInfo } from "react-icons/fa6";
import TableEmptyState from "~/components/shared/Table/LoadingStates/TableEmptyState";
import { Continent, continentToDisplayName } from "~/models";

type Props = {
  continent: Continent;
};

export default function AirportListEmptyState({ continent }: Props) {
  return (
    <TableEmptyState>
      <div className="flex items-center justify-center">
        <FaCircleInfo className="inline mr-3" />
        No airports available in {continentToDisplayName(continent)} yet.
      </div>
    </TableEmptyState>
  );
}
