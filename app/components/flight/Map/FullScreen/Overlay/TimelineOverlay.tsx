import { useState } from "react";
import { HiX } from "react-icons/hi";
import type { Flight, Schedule } from "~/models";
import { MONTHS_SHORT_UPPER } from "~/shared/lib/date";

type Props = {
  flight: Flight;
  onClose: () => void;
};

type Variant = "scheduled" | "estimated" | "actual";

function hhmm(date: Date | null | undefined, timeZone: string | undefined): string {
  if (!date) return "—";
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  });
}

function getUserTzAbbr(): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZoneName: "short" }).formatToParts(new Date());
  return parts.find((p) => p.type === "timeZoneName")?.value ?? "LT";
}

function formatDate(date: Date): string {
  return `${String(date.getUTCDate()).padStart(2, "0")} ${MONTHS_SHORT_UPPER[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

const ROWS: { key: keyof Schedule; label: string; side: "departure" | "arrival" }[] = [
  { key: "offBlockTime", label: "Off-block", side: "departure" },
  { key: "takeoffTime", label: "Takeoff", side: "departure" },
  { key: "arrivalTime", label: "Arrival", side: "arrival" },
  { key: "onBlockTime", label: "On-block", side: "arrival" },
];

export function TimelineOverlay({ flight, onClose }: Props) {
  const { scheduled, estimated, actual } = flight.timesheet;
  const hasEstimated = Boolean(estimated);
  const hasActual = Boolean(actual);

  const [variant, setVariant] = useState<Variant>("scheduled");

  const schedule: Schedule | undefined =
    variant === "scheduled" ? scheduled : variant === "estimated" ? estimated : actual;

  const userTzAbbr = getUserTzAbbr();
  const depTz = flight.departureAirport.timezone;
  const arrTz = flight.destinationAirport.timezone;

  return (
    <section className="bg-gray-100 pointer-events-auto dark:bg-gray-950 text-gray-800 dark:text-gray-300 p-6 w-full sm:w-lg rounded-xl">
      <header className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Timeline</h2>
          <span className="mt-1 block font-mono text-lg font-bold text-gray-900 dark:text-white">
            {formatDate(scheduled.offBlockTime)}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close timeline"
          className="cursor-pointer p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <HiX size={20} />
        </button>
      </header>

      <div className="mb-4 inline-flex rounded-lg bg-gray-200 p-0.5 dark:bg-gray-900">
        <VariantTab
          label="Scheduled"
          active={variant === "scheduled"}
          disabled={false}
          onClick={() => setVariant("scheduled")}
        />
        <VariantTab
          label="Estimated"
          active={variant === "estimated"}
          disabled={!hasEstimated}
          onClick={() => setVariant("estimated")}
        />
        <VariantTab
          label="Actual"
          active={variant === "actual"}
          disabled={!hasActual}
          onClick={() => setVariant("actual")}
        />
      </div>

      <div className="grid grid-cols-[max-content_repeat(3,minmax(0,1fr))] gap-x-4 gap-y-2 text-sm">
        <div />
        <ColumnHeader label="Zulu" />
        <ColumnHeader label="Airport" />
        <ColumnHeader label={userTzAbbr} />

        {ROWS.map((row) => {
          const value = schedule ? (schedule[row.key] as Date | null) : null;
          const airportTz = row.side === "departure" ? depTz : arrTz;
          return (
            <RowGroup
              key={row.key}
              label={row.label}
              zuluTime={hhmm(value, "UTC")}
              airportTime={hhmm(value, airportTz)}
              userTime={hhmm(value, undefined)}
              userTzAbbr={userTzAbbr}
            />
          );
        })}
      </div>
    </section>
  );
}

function VariantTab({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer rounded-md px-3 py-1 text-[11px] font-bold uppercase tracking-widest transition ${
        active
          ? "bg-white text-indigo-600 shadow-sm dark:bg-gray-800 dark:text-indigo-300"
          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      } disabled:cursor-not-allowed disabled:text-gray-300 dark:disabled:text-gray-600`}
    >
      {label}
    </button>
  );
}

function ColumnHeader({ label }: { label: string }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</div>
  );
}

function RowGroup({
  label,
  zuluTime,
  airportTime,
  userTime,
  userTzAbbr,
}: {
  label: string;
  zuluTime: string;
  airportTime: string;
  userTime: string;
  userTzAbbr: string;
}) {
  return (
    <>
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</div>
      <Cell time={zuluTime} suffix="Z" />
      <Cell time={airportTime} suffix="L" />
      <Cell time={userTime} suffix={userTzAbbr} />
    </>
  );
}

function Cell({ time, suffix }: { time: string; suffix: string }) {
  const muted = time === "—";
  return (
    <div className="font-mono tabular-nums">
      <span
        className={`text-sm font-semibold ${muted ? "text-gray-400 dark:text-gray-600" : "text-gray-800 dark:text-gray-100"}`}
      >
        {time}
      </span>
      {!muted && <span className="ms-0.5 text-[10px] font-normal text-gray-500 dark:text-gray-400">{suffix}</span>}
    </div>
  );
}
