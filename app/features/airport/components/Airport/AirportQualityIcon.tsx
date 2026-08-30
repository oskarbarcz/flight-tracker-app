import { Tooltip } from "flowbite-react";
import React from "react";
import { DATA_QUALITY_ICON, DATA_QUALITY_TONE } from "~/features/airport/components/Airport/dataQuality";
import type { DataQuality } from "~/features/airport/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  quality: DataQuality;
};

export function AirportQualityIcon({ quality }: Props) {
  const Icon = DATA_QUALITY_ICON[quality];
  const label = `${toHuman.airport.dataQuality(quality)} data quality`;

  return (
    <span className="relative inline-flex shrink-0">
      <Tooltip content={label}>
        <Icon role="img" aria-label={label} className={`size-4 ${DATA_QUALITY_TONE[quality]}`} />
      </Tooltip>
    </span>
  );
}
