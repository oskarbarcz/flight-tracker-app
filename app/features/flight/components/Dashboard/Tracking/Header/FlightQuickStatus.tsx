import { Button } from "flowbite-react";
import React from "react";
import { FaRotateRight } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { useAdsbData } from "~/features/adsb/hooks/useAdsbData";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { AdsbSignal, AocStatus, adsbSignal, aocStatus } from "~/features/flight/lib/quickStatus";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Reading = {
  label: string;
  dot: string;
  text: string;
  pulse?: boolean;
};

const AOC_READINGS: Record<AocStatus, Reading> = {
  [AocStatus.Connected]: { label: "Connected", dot: "bg-green-500", text: "text-green-700 dark:text-green-400" },
  [AocStatus.Connecting]: {
    label: "Connecting",
    dot: "bg-sky-500",
    text: "text-sky-700 dark:text-sky-400",
    pulse: true,
  },
  [AocStatus.Error]: { label: "Error", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
};

const ADSB_READINGS: Record<AdsbSignal, Reading> = {
  [AdsbSignal.Online]: { label: "Online", dot: "bg-green-500", text: "text-green-700 dark:text-green-400" },
  [AdsbSignal.Offline]: { label: "Offline", dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-400" },
  [AdsbSignal.NoSignal]: {
    label: "No signal",
    dot: "bg-gray-400 dark:bg-gray-500",
    text: "text-gray-500 dark:text-gray-400",
  },
};

function StatusReading({ label, description, reading }: { label: string; description: string; reading: Reading }) {
  return (
    <div className="flex items-center gap-1.5 @2xl:col-span-3 @2xl:grid @2xl:grid-cols-subgrid">
      <dt title={description}>
        <FieldLabel>{label}</FieldLabel>
        <span className="sr-only">{description}</span>
      </dt>
      <dd className="contents">
        <span
          className={twMerge(
            "size-2 shrink-0 rounded-full",
            reading.dot,
            reading.pulse === true && "motion-safe:animate-pulse",
          )}
          aria-hidden={true}
        />
        <span className={twMerge("text-2xs font-bold uppercase tracking-wider", reading.text)}>{reading.label}</span>
      </dd>
    </div>
  );
}

type Props = {
  className?: string;
};

export function FlightQuickStatus({ className }: Props) {
  const { flight, loadsheets, connectionStatus, reconnect } = useTrackedFlight();
  const { flightPath } = useAdsbData();

  if (!flight) {
    return null;
  }

  const signal = adsbSignal(flight.status, loadsheets.final !== null, flightPath.length > 0);

  return (
    <div className={twMerge("flex items-center gap-3", className)}>
      <dl className="flex flex-wrap items-center gap-x-5 gap-y-1.5 @2xl:grid @2xl:grid-cols-[auto_auto_auto] @2xl:gap-x-1.5">
        <StatusReading
          label="AOC"
          description="Live link to airline operations"
          reading={AOC_READINGS[aocStatus(connectionStatus)]}
        />
        <StatusReading label="ADS-B" description="Live aircraft position feed" reading={ADSB_READINGS[signal]} />
      </dl>
      {connectionStatus === "lost" && (
        <Button size="xs" color="light" onClick={reconnect}>
          <FaRotateRight className="mr-1.5" size={12} aria-hidden={true} />
          Retry
        </Button>
      )}
    </div>
  );
}
