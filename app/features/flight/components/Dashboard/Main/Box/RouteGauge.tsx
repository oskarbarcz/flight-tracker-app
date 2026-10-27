import React from "react";
import { FaPlane } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import type { Flight, FlightPathElement } from "~/features/flight";
import { type BlockTimeSummary, blockTimeSummary, type TimeProvenance } from "~/features/flight/lib/blockEvents";
import { computeFlightProgress, type FlightProgress } from "~/features/flight/lib/flightProgress";
import { formatDuration } from "~/shared/lib/time";
import { Quantity } from "~/shared/ui/Display/Quantity";

const BLOCK_LABELS: Record<TimeProvenance, string> = {
  actual: "Block",
  estimated: "Est. block",
  scheduled: "Sched. block",
};

function nauticalMiles(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

function Endpoint({ iata, city, align }: { iata: string; city: string; align: "start" | "end" }) {
  return (
    <div className={twMerge("flex min-w-0 shrink-0 flex-col", align === "end" ? "items-end text-end" : "items-start")}>
      <span className="font-mono text-3xl font-bold leading-none text-gray-900 dark:text-white">{iata}</span>
      <span className="max-w-32 truncate text-sm text-gray-600 dark:text-gray-300">{city}</span>
    </div>
  );
}

function Dot({ filled, className }: { filled: boolean; className: string }) {
  return (
    <span
      className={twMerge(
        "absolute top-1/2 size-2 -translate-y-1/2 rounded-full",
        filled ? "bg-indigo-500" : "border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900",
        className,
      )}
    />
  );
}

type GaugeProps = {
  fraction: number;
  departed: boolean;
  arrived: boolean;
  live: boolean;
  valueText: string;
};

function Gauge({ fraction, departed, arrived, live, valueText }: GaugeProps) {
  const span = `(100% - 0.5rem) * ${fraction}`;
  const progressProps = live
    ? {
        role: "progressbar",
        "aria-label": "Distance flown",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": Math.round(fraction * 100),
        "aria-valuetext": valueText,
      }
    : { "aria-hidden": true };

  return (
    <div className="relative h-7.5 min-w-16 flex-1 self-start" {...progressProps}>
      <span className="absolute inset-x-1 top-1/2 -translate-y-1/2 border-t border-dashed border-gray-300 dark:border-gray-600" />
      {(live || arrived) && (
        <span
          className="absolute start-1 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-indigo-500 motion-safe:transition-[width] motion-safe:duration-500"
          style={{ width: `calc(${span})` }}
        />
      )}
      <Dot filled={departed} className="start-0" />
      <Dot filled={arrived} className="end-0" />
      {live && (
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-0.5 motion-safe:transition-[left] motion-safe:duration-500 dark:bg-gray-900"
          style={{ left: `calc(0.25rem + ${span})` }}
        >
          <FaPlane className="size-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden={true} />
        </span>
      )}
    </div>
  );
}

function DistanceFigures({ progress, live }: { progress: FlightProgress; live: boolean }) {
  if (live) {
    return (
      <span className="inline-flex flex-wrap items-baseline justify-center gap-x-1.5">
        <Quantity value={nauticalMiles(progress.flownNm)} unit="nm" label="flown" />
        <span className="text-xs text-gray-500 dark:text-gray-400" aria-hidden={true}>
          ·
        </span>
        <Quantity value={nauticalMiles(progress.remainingNm)} unit="nm" label="to go" />
      </span>
    );
  }

  return (
    <Quantity
      value={nauticalMiles(progress.totalNm)}
      unit="nm"
      label={progress.phase === "arrived" ? "flown" : "great circle"}
    />
  );
}

function BlockFigure({ block }: { block: BlockTimeSummary }) {
  return (
    <span className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
      {BLOCK_LABELS[block.provenance]}{" "}
      <span className="font-mono text-sm font-bold tabular-nums text-gray-900 dark:text-white">
        {formatDuration(block.minutes)}
      </span>
      {block.minutes !== block.scheduledMinutes && (
        <>
          {" · sched "}
          <span className="font-mono tabular-nums">{formatDuration(block.scheduledMinutes)}</span>
        </>
      )}
    </span>
  );
}

type Props = {
  flight: Flight;
  path: FlightPathElement[];
  className?: string;
};

export function RouteGauge({ flight, path, className }: Props) {
  const progress = computeFlightProgress(flight, path);
  const live = progress.phase === "enroute" && progress.hasLivePosition;
  const arrived = progress.phase === "arrived";
  const fraction = live ? progress.fraction : arrived ? 1 : 0;
  const valueText = `${nauticalMiles(progress.flownNm)} nautical miles flown, ${nauticalMiles(progress.remainingNm)} to go`;

  return (
    <div className={twMerge("flex min-w-0 flex-col gap-2", className)}>
      <div className="flex min-w-0 items-center gap-3">
        <Endpoint iata={flight.departureAirport.iataCode} city={flight.departureAirport.city.name} align="start" />
        <Gauge
          fraction={fraction}
          departed={progress.phase !== "preflight"}
          arrived={arrived}
          live={live}
          valueText={valueText}
        />
        <Endpoint iata={flight.destinationAirport.iataCode} city={flight.destinationAirport.city.name} align="end" />
      </div>
      <div className="flex flex-col items-center gap-0.5 text-center">
        <DistanceFigures progress={progress} live={live} />
        <BlockFigure block={blockTimeSummary(flight.timesheet)} />
      </div>
    </div>
  );
}
