import { Badge } from "flowbite-react";
import React from "react";
import type { Aircraft } from "~/features/aircraft/model";

type Props = {
  aircraft: Aircraft;
};

export function CabinCoverageBadge({ aircraft }: Props) {
  const layout = aircraft.cabinLayout;

  if (layout === null) {
    return (
      <Badge color="gray" size="sm" className="w-fit">
        No cabin
      </Badge>
    );
  }

  if (layout.mismatched) {
    return (
      <Badge color="warning" size="sm" className="w-fit font-mono">
        {layout.id} · mismatched
      </Badge>
    );
  }

  return (
    <Badge color="success" size="sm" className="w-fit font-mono">
      {layout.id}
    </Badge>
  );
}
