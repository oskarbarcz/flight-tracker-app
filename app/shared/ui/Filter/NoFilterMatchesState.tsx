import { Button } from "flowbite-react";
import React from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { EmptyStateIcon } from "~/shared/ui/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/shared/ui/Table/LoadingStates/EmptyStateText";
import { TableEmptyState } from "~/shared/ui/Table/LoadingStates/TableEmptyState";

type Props = {
  subject: string;
  onClear: () => void;
};

export function NoFilterMatchesState({ subject, onClear }: Props) {
  return (
    <TableEmptyState>
      <EmptyStateIcon icon={FaCircleInfo} color="blue" />
      <EmptyStateText title={`No ${subject} match your filter.`} paragraph="Try a different term." />
      <Button color="light" className="mx-auto w-fit cursor-pointer" onClick={onClear}>
        Clear filter
      </Button>
    </TableEmptyState>
  );
}
