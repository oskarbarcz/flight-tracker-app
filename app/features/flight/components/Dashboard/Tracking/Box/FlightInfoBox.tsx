import React from "react";
import { FaPlane, FaPlaneCircleExclamation } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import type { Diversion } from "~/features/diversion";
import { FlightStatus, isFilledSchedule } from "~/features/flight";
import { FlightConnectionFooter } from "~/features/flight/components/Dashboard/Tracking/Box/FlightConnectionFooter";
import { FlightIdentity } from "~/features/flight/components/FlightIdentity";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { Container, type ContainerClassProps } from "~/shared/ui/Layout/Container";

function calculateBlockTime(offBlockTime: Date, onBlockTime: Date): string {
  const diff = Math.abs(onBlockTime.getTime() - offBlockTime.getTime());
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

function formatTime(date: Date): string {
  return date.toISOString().slice(11, 16);
}

type FlightInfoBoxProps = ContainerClassProps;

export function FlightInfoBox({ className }: FlightInfoBoxProps) {
  const { flight, diversion } = useTrackedFlight();
  if (!flight) {
    return <div>Loading...</div>;
  }

  const { timesheet } = flight;
  const scheduledBlockTime = calculateBlockTime(timesheet.scheduled.offBlockTime, timesheet.scheduled.onBlockTime);
  const showEstimated = flight.status !== FlightStatus.Created && flight.status !== FlightStatus.Ready;
  const estimated = showEstimated && isFilledSchedule(timesheet.estimated) ? timesheet.estimated : null;
  const estimatedBlockTime = estimated ? calculateBlockTime(estimated.offBlockTime, estimated.onBlockTime) : null;

  return (
    <Container className={twMerge("pt-4", className)} padding="condensed">
      <FlightIdentity
        operator={flight.operator}
        flightNumber={flight.flightNumber}
        aircraftId={flight.aircraft.id}
        registration={flight.aircraft.registration}
      />

      <RouteRow
        departureIata={flight.departureAirport.iataCode}
        departureCity={flight.departureAirport.city.name}
        destinationIata={flight.destinationAirport.iataCode}
        destinationCity={flight.destinationAirport.city.name}
        scheduledBlockTime={scheduledBlockTime}
        estimatedBlockTime={estimatedBlockTime}
        diverted={Boolean(diversion)}
      />

      {diversion && <DiversionBanner diversion={diversion} />}

      <TimesheetRow
        scheduledOffBlock={timesheet.scheduled.offBlockTime}
        scheduledOnBlock={timesheet.scheduled.onBlockTime}
        estimatedOffBlock={estimated?.offBlockTime ?? null}
        estimatedOnBlock={estimated?.onBlockTime ?? null}
      />

      <FlightConnectionFooter />
    </Container>
  );
}

function RouteRow({
  departureIata,
  departureCity,
  destinationIata,
  destinationCity,
  scheduledBlockTime,
  estimatedBlockTime,
  diverted,
}: {
  departureIata: string;
  departureCity: string;
  destinationIata: string;
  destinationCity: string;
  scheduledBlockTime: string;
  estimatedBlockTime: string | null;
  diverted: boolean;
}) {
  return (
    <div className="mt-2 flex items-center justify-between gap-3">
      <AirportColumn iata={departureIata} city={departureCity} align="start" />
      <div className="flex shrink-0 flex-col items-center">
        <FaPlane className="text-gray-500 dark:text-gray-400" />
        {estimatedBlockTime && (
          <span className="mt-1 font-mono text-sm font-semibold text-green-500">{estimatedBlockTime}</span>
        )}
        <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{scheduledBlockTime}</span>
      </div>
      <AirportColumn iata={destinationIata} city={destinationCity} align="end" struck={diverted} />
    </div>
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
  const baseTextColor = struck ? "text-gray-400 dark:text-gray-500 line-through decoration-2" : undefined;
  return (
    <div
      className={`flex min-w-0 flex-col font-bold ${align === "end" ? "items-end text-end" : "items-start text-start"}`}
    >
      <span className={`text-3xl tracking-tight sm:text-4xl ${baseTextColor ?? ""}`}>{iata}</span>
      <span
        className={`max-w-full truncate text-sm font-medium ${baseTextColor ?? "text-gray-600 dark:text-gray-300"}`}
      >
        {city}
      </span>
    </div>
  );
}

function DiversionBanner({ diversion }: { diversion: Diversion }) {
  return (
    <div className="-mx-1 flex items-center gap-3 rounded-lg border border-red-500/60 bg-red-50 px-3 py-2 dark:bg-red-950/40">
      <FaPlaneCircleExclamation className="shrink-0 text-red-600 dark:text-red-500" />
      <div className="flex min-w-0 flex-col">
        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-red-600 dark:text-red-500">
          Diverting to
        </span>
        <span className="truncate text-sm font-semibold text-red-700 dark:text-red-400">
          <span className="font-mono">{diversion.airport.icaoCode}</span>
          <span className="mx-1.5 text-red-400 dark:text-red-600">·</span>
          {diversion.airport.city.name}
        </span>
      </div>
    </div>
  );
}

function TimesheetRow({
  scheduledOffBlock,
  scheduledOnBlock,
  estimatedOffBlock,
  estimatedOnBlock,
}: {
  scheduledOffBlock: Date;
  scheduledOnBlock: Date;
  estimatedOffBlock: Date | null;
  estimatedOnBlock: Date | null;
}) {
  return (
    <div className="mt-2 flex items-end justify-between">
      <TimesheetSide label="Off-block" scheduled={scheduledOffBlock} estimated={estimatedOffBlock} align="start" />
      <TimesheetSide label="On-block" scheduled={scheduledOnBlock} estimated={estimatedOnBlock} align="end" />
    </div>
  );
}

function TimesheetSide({
  label,
  scheduled,
  estimated,
  align,
}: {
  label: string;
  scheduled: Date;
  estimated: Date | null;
  align: "start" | "end";
}) {
  const alignClass = align === "end" ? "items-end text-end" : "items-start text-start";
  return (
    <div className={`flex flex-col gap-0.5 ${alignClass}`}>
      <span className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {label}
      </span>
      {estimated && (
        <>
          <span className="text-[0.65rem] font-bold uppercase tracking-widest text-green-500">On time</span>
          <span className="font-mono text-2xl font-bold text-green-500">{formatTime(estimated)}</span>
        </>
      )}
      <span className="font-mono text-xs text-gray-500 dark:text-gray-400">Sched. {formatTime(scheduled)}</span>
    </div>
  );
}
