import { Select } from "flowbite-react";
import React from "react";
import { LuX } from "react-icons/lu";
import type { PostcardFilters } from "~/features/postcard/lib/filterPostcards";
import type { PlacedPostcard } from "~/features/postcard/model";
import { FilterInput } from "~/shared/ui/Filter/FilterInput";

type Props = {
  filters: PostcardFilters;
  postcards: PlacedPostcard[];
  isFiltering: boolean;
  onChange: (name: "search" | "country", value: string) => void;
  onClear: () => void;
};

function countriesIn(postcards: PlacedPostcard[]) {
  const named = new Map<string, string>();

  for (const postcard of postcards) {
    named.set(postcard.country.code, postcard.country.name);
  }

  return [...named.entries()].sort((left, right) => left[1].localeCompare(right[1]));
}

export function PostcardToolbar({ filters, postcards, isFiltering, onChange, onClear }: Props) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <FilterInput
        className="w-64"
        placeholder="Search by city or country"
        value={filters.search}
        onChange={(value) => onChange("search", value)}
      />

      <Select
        sizing="sm"
        className="w-56"
        aria-label="Filter by country"
        value={filters.country}
        onChange={(event) => onChange("country", event.target.value)}
      >
        <option value="">Every country</option>
        {countriesIn(postcards).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </Select>

      {isFiltering && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <LuX className="size-3.5" />
          Show every postcard
        </button>
      )}
    </div>
  );
}
