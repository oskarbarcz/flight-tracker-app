import React from "react";
import type { IconType } from "react-icons";
import { LuBuilding2, LuDoorOpen, LuPlaneLanding, LuSquareParking, LuTowerControl } from "react-icons/lu";
import { ChangeRequestResource } from "~/features/change-request/model";

const KIND_ICONS: Record<ChangeRequestResource, IconType> = {
  [ChangeRequestResource.Airport]: LuTowerControl,
  [ChangeRequestResource.ParkingPosition]: LuSquareParking,
  [ChangeRequestResource.Gate]: LuDoorOpen,
  [ChangeRequestResource.Terminal]: LuBuilding2,
  [ChangeRequestResource.Runway]: LuPlaneLanding,
};

type Props = {
  resource: ChangeRequestResource;
  className?: string;
};

export function ChangeRequestKindIcon({ resource, className }: Props) {
  const Icon = KIND_ICONS[resource];
  return <Icon aria-hidden={true} className={className} />;
}
