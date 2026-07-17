import { FaPlane } from "react-icons/fa";
import type { AirportOnFlight } from "~/features/flight";

type Props = {
  departure: AirportOnFlight;
  destination: AirportOnFlight;
  fraction: number;
};

function Endpoint({ airport, align }: { airport: AirportOnFlight; align: "start" | "end" }) {
  return (
    <div className={align === "end" ? "text-right" : ""}>
      <div className="font-mono text-sm font-bold leading-none text-gray-900 dark:text-white">{airport.iataCode}</div>
      <div className="mt-1 max-w-[7rem] truncate text-[11px] leading-none text-gray-500 dark:text-gray-400">
        {airport.city}
      </div>
    </div>
  );
}

export function JourneyRibbon({ departure, destination, fraction }: Props) {
  const percent = Math.min(100, Math.max(0, fraction * 100));

  return (
    <div className="flex items-center gap-3">
      <Endpoint airport={departure} align="start" />

      <div className="relative h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-800">
        <span className="absolute -left-0.5 top-1/2 size-2 -translate-y-1/2 rounded-full bg-emerald-500" />
        <span className="absolute -right-0.5 top-1/2 size-2 -translate-y-1/2 rounded-full border-2 border-gray-400 bg-white dark:border-gray-500 dark:bg-gray-900" />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
          style={{ width: `${percent}%` }}
        />
        <span
          className="absolute top-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gray-200 bg-white text-indigo-500 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-indigo-300"
          style={{ left: `${percent}%` }}
        >
          <FaPlane className="size-3 rotate-45" />
        </span>
      </div>

      <Endpoint airport={destination} align="end" />
    </div>
  );
}
