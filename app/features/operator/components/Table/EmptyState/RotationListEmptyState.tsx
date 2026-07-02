import { Button } from "flowbite-react";
import React from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import { EmptyStateIcon } from "~/shared/ui/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/shared/ui/Table/LoadingStates/EmptyStateText";
import { TableEmptyState } from "~/shared/ui/Table/LoadingStates/TableEmptyState";

type Props = {
  operatorId: string;
};

export function RotationListEmptyState({ operatorId }: Props) {
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
