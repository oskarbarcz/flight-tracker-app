import React from "react";
import type { CityRef } from "~/features/city/model";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";

type Props = {
  cities: CityRef[];
};

export function CitiesWithoutPostcard({ cities }: Props) {
  if (cities.length === 0) {
    return <ContainerEmptyState>Every city has a postcard.</ContainerEmptyState>;
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white px-3.5 py-3.5 dark:border-gray-800 dark:bg-gray-900">
      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
        These cities hold no postcard at all, so they appear nowhere above. Drawing the missing art gives each of them
        one.
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {cities.map((city) => (
          <li
            key={city.id}
            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
          >
            {city.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
