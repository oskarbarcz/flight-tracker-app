import { Badge, Button } from "flowbite-react";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { AircraftImage } from "~/features/aircraft/components/Aircraft/AircraftImage";
import type { Airframe } from "~/features/airframe";
import {
  formatCruiseSpeed,
  formatPerformanceCode,
  formatServiceCeiling,
  formatWeightCategory,
} from "~/features/airframe/lib/formatAirframe";
import { formatDayDate } from "~/features/stats/lib/heatmap";
import type { AircraftTypeStat } from "~/features/stats/model";
import { formatDuration } from "~/shared/lib/time";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  stat: AircraftTypeStat;
  airframe: Airframe | undefined;
};

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <FieldLabel>{label}</FieldLabel>
      <span className="font-mono text-sm font-bold tabular-nums text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-gray-100 py-1.5 dark:border-gray-800">
      <FieldLabel>{label}</FieldLabel>
      <span className="font-mono text-xs tabular-nums text-gray-700 dark:text-gray-200">{value}</span>
    </div>
  );
}

export function AircraftTypeCard({ stat, airframe }: Props) {
  const [showSpecs, setShowSpecs] = useState(false);

  const flownOn = formatDayDate(new Date(stat.firstFlownAt));

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="relative aspect-[16/9] bg-gray-50 dark:bg-gray-800">
        <AircraftImage type={stat.type} name={airframe?.name} className="h-full" />
        <Badge color="info" size="xs" className="absolute left-2 top-2 font-mono">
          {stat.type}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {airframe?.name ?? stat.type}
          </span>
          <span className="font-mono text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
            First flown {flownOn}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Figure label="Flights" value={stat.flights.toLocaleString("en-US")} />
          <Figure label="Block" value={formatDuration(stat.blockMinutes)} />
          <Figure label="Distance" value={`${stat.distanceNm.toLocaleString("en-US")} nm`} />
        </div>

        {airframe && (
          <>
            <Button
              size="xs"
              color="subtle"
              className="w-fit"
              aria-expanded={showSpecs}
              onClick={() => setShowSpecs(!showSpecs)}
            >
              <FaChevronDown
                size={10}
                aria-hidden={true}
                className={twMerge(
                  "me-1.5 transition-transform duration-200 motion-reduce:transition-none",
                  showSpecs && "rotate-180",
                )}
              />
              {showSpecs ? "Hide specs" : "Specs"}
            </Button>

            {showSpecs && (
              <div className="flex flex-col">
                <SpecRow label="Cruise" value={formatCruiseSpeed(airframe.cruiseSpeed)} />
                <SpecRow label="Ceiling" value={formatServiceCeiling(airframe.serviceCeiling)} />
                <SpecRow label="Wake" value={formatWeightCategory(airframe.weightCategory)} />
                <SpecRow label="Approach" value={formatPerformanceCode(airframe.performanceCode)} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
