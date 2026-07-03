import logo from "~/assets/logo.svg";
import logoWhite from "~/assets/logo.white.svg";
import type { Flight } from "~/features/flight";
import { LiveFlightList } from "~/features/flight/components/Map/Landing/LiveFlightList";
import { PrivateFlightLookupForm } from "~/features/flight/components/Map/Landing/PrivateFlightLookupForm";

type Props = {
  flights: Flight[];
  loading: boolean;
};

export function FlightTrackerLauncher({ flights, loading }: Props) {
  return (
    <section className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
      <header className="flex items-center gap-3 border-b border-gray-200 p-5 dark:border-gray-800">
        <img src={logo} alt="Flight Tracker logo" className="size-8 dark:hidden" />
        <img src={logoWhite} alt="Flight Tracker logo" className="hidden size-8 dark:block" />
        <div>
          <h1 className="text-xl font-bold text-indigo-500">Flight Tracker</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Follow flights live around the world</p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Live flights</h2>
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
