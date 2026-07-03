import { FaUser } from "react-icons/fa6";
import { HiX } from "react-icons/hi";
import type { Flight } from "~/features/flight";

type Props = {
  flight: Flight;
  onClose: () => void;
};

function totalFlightHours(minutes: number): string {
  return `${Math.floor(minutes / 60).toLocaleString("en-US")}h`;
}

export function PilotOverlay({ flight, onClose }: Props) {
  const pilot = flight.pilot;

  return (
    <section className="bg-gray-100 pointer-events-auto dark:bg-gray-950 text-gray-800 dark:text-gray-300 p-6 w-full sm:w-sm rounded-xl">
      <header className="mb-4 flex items-start justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Pilot in command</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close pilot info"
          className="cursor-pointer p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <HiX size={20} />
        </button>
      </header>

      {pilot ? (
        <>
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              <FaUser size={20} />
            </span>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{pilot.name}</div>
              <div className="font-mono text-xs text-gray-500">{pilot.pilotLicenseId}</div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Total flight time
            </span>
            <span className="font-mono text-lg font-bold text-gray-900 dark:text-white">
              {totalFlightHours(pilot.totalFlightTime)}
            </span>
          </div>
        </>
      ) : (
        <div className="rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          No pilot assigned to this flight.
        </div>
      )}
    </section>
  );
}
