import React from "react";
import { LuPackageX, LuTriangleAlert } from "react-icons/lu";
import { PanelEmptyState } from "~/shared/ui/Display/PanelEmptyState";

export type HoldGap = "uncurated" | "failed";

type Props = {
  gap: HoldGap;
  type?: string;
};

const COPY: Record<HoldGap, { title: string; body: string }> = {
  uncurated: {
    title: "No hold configuration",
    body: "Load on this airframe type is reported by weight and volume, without positions or compartments.",
  },
  failed: {
    title: "Hold configuration unavailable",
    body: "The configuration did not load. Reload to try again.",
  },
};

export function HoldUnavailableState({ gap, type }: Props) {
  const { title, body } = COPY[gap];
  const Icon = gap === "uncurated" ? LuPackageX : LuTriangleAlert;

  const heading = type !== undefined && gap === "uncurated" ? `${title} for ${type}` : title;

  return <PanelEmptyState icon={Icon} title={heading} body={body} />;
}
