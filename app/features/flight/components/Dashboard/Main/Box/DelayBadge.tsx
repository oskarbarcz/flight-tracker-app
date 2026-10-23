import { Badge } from "flowbite-react";
import React from "react";

type Props = {
  minutes: number | null;
};

export function DelayBadge({ minutes }: Props) {
  if (minutes === null || minutes <= 0) {
    return null;
  }

  return <Badge color="warning">+{minutes} min late</Badge>;
}
