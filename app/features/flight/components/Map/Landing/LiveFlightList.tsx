import { Spinner } from "flowbite-react";
import type { Flight } from "~/features/flight";
import { LiveFlightListItem } from "~/features/flight/components/Map/Landing/LiveFlightListItem";

type Props = {
  flights: Flight[];
  loading: boolean;
};

export function LiveFlightList({ flights, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner color="indigo" size="xl" />
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 px-4 py-10 text-center text-sm text-gray-500 dark:bg-gray-950 dark:text-gray-400">
        No public flights are being tracked right now.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {flights.map((flight) => (
        <LiveFlightListItem key={flight.id} flight={flight} />
      ))}
    </div>
  );
}
