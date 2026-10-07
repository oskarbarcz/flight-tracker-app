import { Button, Tooltip } from "flowbite-react";
import React from "react";
import { LuArrowRight, LuExternalLink, LuEye, LuLink, LuPackage, LuTrash2, LuUsers } from "react-icons/lu";
import { useToast } from "~/app-state/useToast";
import { type Flight, FlightServiceType, FlightSource, FlightStatus, Tracking } from "~/features/flight";
import { toHuman } from "~/i18n/translate";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  flight: Flight;
  hasPreliminaryLoadsheet: boolean;
  onRelease: () => void;
  onRemove: () => void;
  onUpdateTracking: () => void;
  onUpdateServiceType: () => void;
};

export function FlightHeader({
  flight,
  hasPreliminaryLoadsheet,
  onRelease,
  onRemove,
  onUpdateTracking,
  onUpdateServiceType,
}: Props) {
  const { success } = useToast();
  const canRelease = flight.status === FlightStatus.Created && hasPreliminaryLoadsheet;
  const canRemove = flight.status === FlightStatus.Created;
  const canUpdateServiceType = flight.status === FlightStatus.Created;
  const ServiceTypeIcon = flight.serviceType === FlightServiceType.Cargo ? LuPackage : LuUsers;
  const isTrackingDisabled = flight.tracking === Tracking.Disabled;

  const handleCopyTrackingLink = () => {
    const trackingUrl = `${window.location.origin}/map/${flight.id}`;
    navigator.clipboard.writeText(trackingUrl).then(() => {
      success("Tracking link copied to clipboard.");
    });
  };

  const handleOpenTrackingMap = () => {
    window.open(`/map/${flight.id}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Container>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {flight.flightNumberWithoutSpaces}
            </h1>
            <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-2xs font-bold uppercase tracking-widest text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
              {toHuman.flight.status.standard(flight.status, flight.serviceType)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2 font-mono font-bold">
              <span>{flight.departureAirport.iataCode}</span>
              <LuArrowRight className="size-4 text-gray-500 dark:text-gray-400" strokeWidth={3.75} aria-hidden={true} />
              <span>{flight.destinationAirport.iataCode}</span>
            </div>
            <span className="truncate text-sm text-gray-500 dark:text-gray-400">
              {flight.departureAirport.city.name} → {flight.destinationAirport.city.name}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {canRelease && (
            <Button color="indigo" outline size="sm" onClick={onRelease}>
              Release for pilot
            </Button>
          )}
          {canUpdateServiceType && (
            <Tooltip content="Change service type">
              <Button
                color="light"
                size="sm"
                onClick={onUpdateServiceType}
                aria-label="Change service type"
                className="cursor-pointer px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500"
              >
                <ServiceTypeIcon className="size-4" />
              </Button>
            </Tooltip>
          )}
          <Tooltip content="Change tracking visibility">
            <Button
              color="light"
              size="sm"
              onClick={onUpdateTracking}
              aria-label="Change tracking visibility"
              className="cursor-pointer px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500"
            >
              <LuEye className="size-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Copy tracking link">
            <Button
              color="light"
              size="sm"
              onClick={handleCopyTrackingLink}
              disabled={isTrackingDisabled}
              aria-label="Copy tracking link"
              className="cursor-pointer px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500"
            >
              <LuLink className="size-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Open tracking map">
            <Button
              color="light"
              size="sm"
              onClick={handleOpenTrackingMap}
              disabled={isTrackingDisabled}
              aria-label="Open tracking map"
              className="cursor-pointer px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500"
            >
              <LuExternalLink className="size-4" />
            </Button>
          </Tooltip>
          {canRemove && (
            <Tooltip content="Remove flight">
              <Button
                color="light"
                size="sm"
                onClick={onRemove}
                aria-label="Remove flight"
                className="cursor-pointer px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-red-500"
              >
                <LuTrash2 className="size-4" />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-200 pt-4 sm:grid-cols-3 lg:grid-cols-6 dark:border-gray-800">
        <Stat label="Aircraft" value={flight.aircraft.airframe.name} />
        <Stat label="Registration" value={flight.aircraft.registration} mono />
        <Stat
          label="Scheduled departure"
          mono
          value={
            <>
              <FormattedIcaoDate date={flight.timesheet.scheduled.takeoffTime} />{" "}
              <FormattedIcaoTime date={flight.timesheet.scheduled.takeoffTime} />
            </>
          }
        />
        <Stat label="Service" value={<span className="capitalize">{flight.serviceType}</span>} />
        <Stat label="Tracking" value={<span className="capitalize">{flight.tracking}</span>} />
        <Stat label="Source" value={flight.source === FlightSource.SimBrief ? "SimBrief" : "Manual"} />
      </dl>
    </Container>
  );
}

function Stat({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <dt className="text-2xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className={`mt-1 text-sm font-medium text-gray-800 dark:text-gray-100 ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
