import React from "react";
import { FaPlane, FaPlaneCircleExclamation } from "react-icons/fa6";
import { PiUserSoundBold } from "react-icons/pi";
import { AircraftRegistrationLink } from "~/features/aircraft/components/Aircraft/AircraftRegistrationLink";
import type { Diversion } from "~/features/diversion";
import { FlightStatus, isFilledSchedule } from "~/features/flight";
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
    <Container className={className} padding="condensed">
      <Header
        flightNumber={flight.flightNumber}
        callsign={flight.callsign}
        operatorCallsign={flight.operator.callsign}
      />

      <AircraftRow
        aircraftId={flight.aircraft.id}
        airframeName={flight.aircraft.airframe.name}
        registration={flight.aircraft.registration}
        selcal={flight.aircraft.selcal}
        operatorName={flight.operator.shortName}
      />

      <RouteRow
        departureIata={flight.departureAirport.iataCode}
        departureCity={flight.departureAirport.city}
        destinationIata={flight.destinationAirport.iataCode}
        destinationCity={flight.destinationAirport.city}
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
    </Container>
  );
}

function Header({
  flightNumber,
  callsign,
  operatorCallsign,
}: {
  flightNumber: string;
  callsign: string;
  operatorCallsign: string;
}) {
  return (
    <header className="flex flex-col gap-1">
      <h2 className="text-3xl font-bold tracking-tight text-indigo-500 md:text-4xl">{flightNumber}</h2>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
        <span className="font-mono">{callsign}</span>
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <span className="inline-flex items-center gap-1.5 text-xs">
          <PiUserSoundBold className="text-gray-400" />
          <span className="font-mono">{operatorCallsign}</span>
        </span>
      </div>
    </header>
  );
}

function AircraftRow({
  aircraftId,
  airframeName,
  registration,
  selcal,
  operatorName,
}: {
  aircraftId: string;
  airframeName: string;
  registration: string;
  selcal: string;
  operatorName: string;
}) {
  return (
    <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
      <div className="flex flex-wrap items-center gap-2">
        <span>{airframeName}</span>
        <Chip>
          <AircraftRegistrationLink aircraftId={aircraftId} registration={registration} />
        </Chip>
        <Chip>{selcal}</Chip>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Operated by <span className="font-semibold text-gray-800 dark:text-gray-100">{operatorName}</span>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-md border border-gray-300 px-2 py-0.5 font-mono text-xs text-gray-700 dark:border-gray-700 dark:text-gray-200">
      {children}
    </span>
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
      <div className="flex flex-col items-center">
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
    <div className={`flex flex-col font-bold ${align === "end" ? "items-end text-end" : "items-start text-start"}`}>
      <span className={`text-4xl tracking-tight ${baseTextColor ?? ""}`}>{iata}</span>
      <span className={`text-sm font-medium ${baseTextColor ?? "text-gray-600 dark:text-gray-300"}`}>{city}</span>
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
          {diversion.airport.city}
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
