import { Badge } from "flowbite-react";
import React from "react";
import { RotationStatus } from "~/features/rotation";
import { toHuman } from "~/i18n/translate";

type BadgeColor = "success" | "info" | "indigo" | "gray" | "failure";

const statusColor: Record<RotationStatus, BadgeColor> = {
  [RotationStatus.Draft]: "gray",
  [RotationStatus.Ready]: "indigo",
  [RotationStatus.InProgress]: "info",
  [RotationStatus.Finished]: "success",
  [RotationStatus.Canceled]: "failure",
};

type Props = {
  status: RotationStatus;
  size?: "xs" | "sm";
};

export function RotationStatusBadge({ status, size = "xs" }: Props) {
  return (
    <Badge color={statusColor[status]} size={size}>
      {toHuman.rotation.status(status)}
    </Badge>
  );
}
