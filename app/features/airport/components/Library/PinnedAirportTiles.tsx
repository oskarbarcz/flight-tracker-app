import React from "react";
import { LuPin, LuPinOff } from "react-icons/lu";
import { AirportTile } from "~/features/airport/components/Library/AirportTile";
import { usePinnedAirports } from "~/features/airport/lib/usePinnedAirports";

export function PinnedAirportTiles() {
  const { pinned, unpin } = usePinnedAirports();

  if (pinned.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 px-6 py-12 text-center dark:bg-gray-900">
        <LuPin className="text-gray-400" size={24} />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No pinned airports yet. Search above and pin the ones you use often.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pinned.map((airport) => (
        <div key={airport.id} className="group relative">
          <AirportTile airport={airport} className="pr-14" />
          <button
            type="button"
            onClick={() => unpin(airport.id)}
            aria-label={`Unpin ${airport.iataCode}`}
            title="Unpin"
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-gray-400 opacity-0 transition-colors hover:bg-gray-100 hover:text-indigo-600 focus-visible:opacity-100 group-hover:opacity-100 dark:hover:bg-gray-700 dark:hover:text-indigo-400"
          >
            <LuPinOff size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
