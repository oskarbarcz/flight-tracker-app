import { FaArrowRight } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { toHuman } from "~/i18n/translate";
import { type Flight, FlightStatus, isFilledSchedule } from "~/models";

type Props = {
  flight: Flight;
  onClose: () => void;
};

function calculateBlockTime(offBlockTime: Date, onBlockTime: Date) {
  const diff = Math.abs(onBlockTime.getTime() - offBlockTime.getTime());
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours}h ${minutes % 60}m`;
}

export function BasicFlightInfoOverlay({ flight, onClose }: Props) {
  const timesheet = flight.timesheet;
  const scheduledBlockTime = calculateBlockTime(timesheet.scheduled.offBlockTime, timesheet.scheduled.onBlockTime);

  let estimatedBlockTime: string | null = null;
  if (
    flight.status !== FlightStatus.Created &&
    flight.status !== FlightStatus.Ready &&
    isFilledSchedule(timesheet.estimated)
  ) {
    estimatedBlockTime = calculateBlockTime(timesheet.estimated.offBlockTime, timesheet.estimated.onBlockTime);
  }

  return (
    <section className="bg-gray-100 pointer-events-auto dark:bg-gray-950 text-gray-800 dark:text-gray-300 p-6 w-full sm:w-sm rounded-xl">
      <header className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Flight</h2>
          <span className="mt-1 block font-mono text-lg font-bold text-gray-900 dark:text-white">
            {flight.flightNumber}
          </span>
          <span className="mt-1 inline-block rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
            {toHuman.flight.status.standard(flight.status)}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close flight info"
          className="cursor-pointer p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <HiX size={20} />
        </button>
      </header>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">From</div>
          <div className="mt-1 font-mono text-2xl font-bold text-gray-900 dark:text-white">
            {flight.departureAirport.iataCode}
          </div>
          <div className="text-xs text-gray-500">{flight.departureAirport.city}</div>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <FaArrowRight size={14} />
          <span className="mt-1 font-mono text-[11px] text-gray-500">{scheduledBlockTime}</span>
          {estimatedBlockTime && <span className="font-mono text-[11px] text-emerald-600">{estimatedBlockTime}</span>}
        </div>
        <div className="text-end">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">To</div>
          <div className="mt-1 font-mono text-2xl font-bold text-gray-900 dark:text-white">
            {flight.destinationAirport.iataCode}
          </div>
          <div className="text-xs text-gray-500">{flight.destinationAirport.city}</div>
        </div>
      </div>
    </section>
  );
}
