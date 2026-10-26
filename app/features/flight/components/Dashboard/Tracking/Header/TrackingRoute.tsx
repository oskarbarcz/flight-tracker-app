import React from "react";
import { twMerge } from "tailwind-merge";
import type { Flight } from "~/features/flight";
import { TimeCertaintyMark } from "~/features/flight/components/Dashboard/Tracking/TimeCertaintyMark";
import { combinedProvenance, resolveBlockTime, type TimeProvenance } from "~/features/flight/lib/blockEvents";
import { durationMinutes, formatDuration } from "~/shared/lib/time";

function blockMinutes(offBlockTime: Date, onBlockTime: Date): string {
  return formatDuration(durationMinutes(offBlockTime, onBlockTime));
}

type Props = {
  flight: Flight;
  diverted: boolean;
  className?: string;
};

export function TrackingRoute({ flight, diverted, className }: Props) {
  const { timesheet } = flight;
  const offBlock = resolveBlockTime("offBlockTime", timesheet);
  const onBlock = resolveBlockTime("onBlockTime", timesheet);
  const provenance = combinedProvenance(offBlock.provenance, onBlock.provenance);
  const blockTime = blockMinutes(offBlock.time, onBlock.time);
  const scheduledBlockTime = blockMinutes(timesheet.scheduled.offBlockTime, timesheet.scheduled.onBlockTime);
  const primaryProvenance = provenance === "estimated" && blockTime === scheduledBlockTime ? "scheduled" : provenance;

  return (
    <div className={twMerge("flex min-w-0 items-center gap-3", className)}>
      <AirportColumn iata={flight.departureAirport.iataCode} city={flight.departureAirport.city.name} align="start" />
      <div className="relative flex h-7.5 min-w-16 flex-1 items-center justify-center self-start">
        <span
          className="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-300 dark:border-gray-600"
          aria-hidden={true}
        />
        <span
          title="Block time"
          className="relative flex flex-col items-center bg-white px-2 leading-tight dark:bg-gray-900"
        >
          <span className="sr-only">Block time</span>
          <BlockTime provenance={primaryProvenance} value={blockTime} emphasised />
          {blockTime !== scheduledBlockTime && (
            <BlockTime provenance="scheduled" value={scheduledBlockTime} emphasised={false} />
          )}
        </span>
      </div>
      <AirportColumn
        iata={flight.destinationAirport.iataCode}
        city={flight.destinationAirport.city.name}
        align="end"
        struck={diverted}
      />
    </div>
  );
}

function BlockTime({
  provenance,
  value,
  emphasised,
}: {
  provenance: TimeProvenance;
  value: string;
  emphasised: boolean;
}) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-1 whitespace-nowrap font-mono text-xs tabular-nums",
        emphasised ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400",
      )}
    >
      {provenance !== "actual" && (
        <TimeCertaintyMark certainty={provenance} className="text-gray-500 dark:text-gray-400" />
      )}
      {value}
    </span>
  );
}

function AirportColumn({
  iata,
  city,
  align,
  struck = false,
}: {
  iata: string;
  city: string;
  align: "start" | "end";
  struck?: boolean;
}) {
  return (
    <div className={twMerge("flex min-w-0 shrink-0 flex-col", align === "end" ? "items-end text-end" : "items-start")}>
      <span
        className={twMerge(
          "font-mono text-3xl font-bold leading-none text-gray-900 dark:text-white",
          struck && "text-gray-500 line-through decoration-2 dark:text-gray-400",
        )}
      >
        {iata}
      </span>
      <span
        className={twMerge(
          "mt-1 max-w-32 truncate text-sm text-gray-600 dark:text-gray-300",
          struck && "text-gray-500 line-through dark:text-gray-400",
        )}
      >
        {city}
      </span>
    </div>
  );
}
