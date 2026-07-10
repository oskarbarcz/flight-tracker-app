import React from "react";
import { LuPin, LuPinOff } from "react-icons/lu";
import { Link } from "react-router";
import { AirportShape } from "~/features/airport/components/Airport/AirportShape";
import { usePinnedAirports } from "~/features/airport/lib/usePinnedAirports";
import { OptionAvatarFrame } from "~/shared/ui/Form/AdvancedSelect/OptionAvatarFrame";

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
          <Link
            to={`/airports-library/${airport.id}`}
            viewTransition
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 pr-14 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800"
          >
            <OptionAvatarFrame>
              <AirportShape shape={airport.shape} />
            </OptionAvatarFrame>
            <span className="min-w-0">
              <span className="flex min-w-0 items-baseline gap-2">
                <span className="shrink-0 font-mono text-lg font-bold text-gray-900 dark:text-white">
                  {airport.iataCode}
                </span>
                <span className="shrink-0 text-gray-300 dark:text-gray-600">|</span>
                <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{airport.name}</span>
              </span>
              <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                {airport.city}, {airport.country}
              </span>
            </span>
          </Link>
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
