"use client";

import { Button } from "flowbite-react";
import React, { type JSX } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import { EmptyStateIcon } from "~/components/shared/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/components/shared/Table/LoadingStates/EmptyStateText";
import { TableEmptyState } from "~/components/shared/Table/LoadingStates/TableEmptyState";

type Props = {
  operatorId: string;
};

export function RotationListEmptyState({ operatorId }: Props): JSX.Element {
  return (
    <TableEmptyState>
      <EmptyStateIcon icon={FaCircleInfo} color={"blue"} />
      <EmptyStateText
        title="There are no rotations yet."
        paragraph="Rotation links multiple flights into one seamless workflow. Pilots stay focused with a single, fluid interface."
      />
      <Button
        className="space-x-1.5 w-fit mx-auto"
        color="indigo"
        as={Link}
        to={`/operators/${operatorId}/rotations/new`}
      >
        <HiPlus />
        <span>Create new rotation</span>
      </Button>
    </TableEmptyState>
  );
}
