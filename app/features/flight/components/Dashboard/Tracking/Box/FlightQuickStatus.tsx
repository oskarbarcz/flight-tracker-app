import React from "react";
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

function StatusReading({ label, reading }: { label: string; reading: Reading }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <FieldLabel className="inline">{label}</FieldLabel>
      <span
        className={twMerge("size-2 shrink-0 rounded-full", reading.dot, reading.pulse === true && "animate-pulse")}
        aria-hidden={true}
      />
      <span className={twMerge("text-[11px] font-bold uppercase tracking-wider", reading.text)}>{reading.label}</span>
    </span>
  );
}

export function FlightQuickStatus() {
  const { flight, loadsheets, connectionStatus } = useTrackedFlight();
  const { flightPath } = useAdsbData();

  if (!flight) {
    return null;
  }

  const signal = adsbSignal(flight.status, loadsheets.final !== null, flightPath.length > 0);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
      <StatusReading label="AOC" reading={AOC_READINGS[aocStatus(connectionStatus)]} />
      <StatusReading label="ADS-B" reading={ADSB_READINGS[signal]} />
    </div>
  );
}
