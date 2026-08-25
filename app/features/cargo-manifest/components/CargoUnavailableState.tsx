import React from "react";
import type { IconType } from "react-icons";
import { LuLock, LuPackage, LuTriangleAlert } from "react-icons/lu";
import type { CargoGap } from "~/features/cargo-manifest/hooks/useFlightCargo";
import { PanelEmptyState } from "~/shared/ui/Display/PanelEmptyState";

type Props = {
  gap: CargoGap;
};

const COPY: Record<CargoGap, { title: string; body: string; icon: IconType }> = {
  "not-released": {
    title: "Manifest not yet issued",
    body: "The cargo manifest is generated when the flight is released to the pilot.",
    icon: LuPackage,
  },
  "not-generated": {
    title: "No manifest for this flight",
    body: "No cargo manifest has been generated for this flight.",
    icon: LuPackage,
  },
  "no-cargo": {
    title: "No cargo aboard",
    body: "The manifest for this flight accounts for no cargo.",
    icon: LuPackage,
  },
  forbidden: {
    title: "Not available to you",
    body: "The cargo manifest is readable for a flight you captain.",
    icon: LuLock,
  },
  failed: {
    title: "Manifest unavailable",
    body: "The cargo manifest did not load. Reload to try again.",
    icon: LuTriangleAlert,
  },
};

export function CargoUnavailableState({ gap }: Props) {
  const { title, body, icon: Icon } = COPY[gap];

  return <PanelEmptyState icon={Icon} title={title} body={body} />;
}
