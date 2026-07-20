import type { Flight } from "~/features/flight";
import { LiveFlightList } from "~/features/flight/components/Map/Landing/LiveFlightList";
import { PrivateFlightLookupForm } from "~/features/flight/components/Map/Landing/PrivateFlightLookupForm";

type Props = {
  flights: Flight[];
  loading: boolean;
};

export function FlightTrackerLauncher({ flights, loading }: Props) {
  return (
    <section className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-950/20 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/50">
      <header className="border-b border-gray-200 p-5 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Follow flights live</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track any public flight, or open a private link below.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
        <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">Live flights</h2>
        <LiveFlightList flights={flights} loading={loading} />
      </div>

      <footer className="border-t border-gray-200 p-5 dark:border-gray-800">
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          Have a private tracking link? Paste the flight ID to follow it.
        </p>
        <PrivateFlightLookupForm />
      </footer>
    </section>
  );
}
