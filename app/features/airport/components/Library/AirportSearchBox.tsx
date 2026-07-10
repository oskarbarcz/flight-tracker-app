import { TextInput } from "flowbite-react";
import React, { useMemo, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { LuPin } from "react-icons/lu";
import { Link } from "react-router";
import type { Airport } from "~/features/airport";
import { AirportShape } from "~/features/airport/components/Airport/AirportShape";
import { searchAirports } from "~/features/airport/lib/searchAirports";
import { usePinnedAirports } from "~/features/airport/lib/usePinnedAirports";
import { OptionAvatarFrame } from "~/shared/ui/Form/AdvancedSelect/OptionAvatarFrame";

type Props = {
  airports: Airport[];
};

export function AirportSearchBox({ airports }: Props) {
  const [query, setQuery] = useState("");
  const { pin, unpin, isPinned } = usePinnedAirports();

  const results = useMemo(() => searchAirports(airports, query), [airports, query]);
  const hasQuery = query.trim() !== "";

  return (
    <div className="relative">
      <TextInput
        icon={FaMagnifyingGlass}
        sizing="lg"
        placeholder="Search by name, IATA or ICAO"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Search airports"
      />

      {hasQuery ? (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No airports match “{query.trim()}”.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {results.map((airport) => {
                const pinned = isPinned(airport.id);
                return (
                  <li key={airport.id} className="group relative">
                    <Link
                      to={`/airports-library/${airport.id}`}
                      viewTransition
                      className="flex items-center gap-3 py-2.5 pl-3 pr-14 hover:bg-indigo-50 dark:hover:bg-gray-800"
                    >
                      <OptionAvatarFrame>
                        <AirportShape shape={airport.shape} />
                      </OptionAvatarFrame>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-gray-900 dark:text-gray-100">
                          {airport.name}
                        </span>
                        <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-mono font-semibold">{airport.iataCode}</span> ·{" "}
                          <span className="font-mono">{airport.icaoCode}</span> · {airport.city}, {airport.country}
                        </span>
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => (pinned ? unpin(airport.id) : pin(airport))}
                      aria-label={pinned ? `Unpin ${airport.iataCode}` : `Pin ${airport.iataCode}`}
                      aria-pressed={pinned}
                      className={`absolute right-2 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        pinned
                          ? "text-indigo-500 opacity-100"
                          : "text-gray-400 opacity-0 focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
                      }`}
                    >
                      <LuPin size={18} className={pinned ? "fill-current" : ""} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
