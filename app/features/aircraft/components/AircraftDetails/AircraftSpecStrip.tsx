import React from "react";
import { twMerge } from "tailwind-merge";
import type { Aircraft } from "~/features/aircraft";
import { formatCruiseSpeed, formatServiceCeiling, formatWeightCategory } from "~/features/airframe/lib/formatAirframe";
import { DataField } from "~/shared/ui/Display/DataField";

type Props = {
  aircraft: Aircraft;
  className?: string;
};

export function AircraftSpecStrip({ aircraft, className }: Props) {
  const { airframe } = aircraft;

  return (
    <div
      className={twMerge("grid min-w-0 flex-1 grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-6", className)}
    >
      <DataField label="Type code" value={airframe.type} mono />
      <DataField label="Cruise speed" value={formatCruiseSpeed(airframe.cruiseSpeed)} mono />
      <DataField label="Service ceiling" value={formatServiceCeiling(airframe.serviceCeiling)} mono />
      <DataField label="Wake category" value={formatWeightCategory(airframe.weightCategory)} />
      <DataField label="SELCAL" value={aircraft.selcal || "—"} mono />
      <DataField label="Livery" value={aircraft.livery} />
    </div>
  );
}
