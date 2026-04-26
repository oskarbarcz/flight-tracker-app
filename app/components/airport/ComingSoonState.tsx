import React from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { EmptyStateIcon } from "~/components/shared/Table/LoadingStates/EmptyStateIcon";
import { EmptyStateText } from "~/components/shared/Table/LoadingStates/EmptyStateText";
import { TableEmptyState } from "~/components/shared/Table/LoadingStates/TableEmptyState";

type Props = {
  feature: string;
  description?: string;
};

export function ComingSoonState({ feature, description }: Props) {
  return (
    <TableEmptyState>
      <EmptyStateIcon icon={FaCircleInfo} color="blue" />
      <EmptyStateText
        title={`${feature} management is coming soon.`}
        paragraph={description ?? "This area is on the roadmap and will land in a future release."}
      />
    </TableEmptyState>
  );
}
