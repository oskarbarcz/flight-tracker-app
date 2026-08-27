import { Badge } from "flowbite-react";
import React from "react";
import { DataQuality } from "~/features/airport/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  quality: DataQuality;
  size?: "xs" | "sm";
};

const QUALITY_COLOR: Record<DataQuality, string> = {
  [DataQuality.Low]: "gray",
  [DataQuality.High]: "info",
  [DataQuality.Flagship]: "indigo",
};

export function DataQualityBadge({ quality, size = "sm" }: Props) {
  return (
    <Badge color={QUALITY_COLOR[quality]} size={size}>
      {toHuman.airport.dataQuality(quality)}
    </Badge>
  );
}
