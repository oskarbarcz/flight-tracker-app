import { Select } from "flowbite-react";
import React from "react";
import { LuX } from "react-icons/lu";
import { countriesHeld } from "~/features/postcard/lib/collection";
import type { CollectedPostcard } from "~/features/postcard/model";

type Props = {
  postcards: CollectedPostcard[];
  selected: string;
  onSelect: (code: string) => void;
};

export function PostcardCountryFilter({ postcards, selected, onSelect }: Props) {
  const countries = countriesHeld(postcards);

  if (countries.length < 2) {
    return null;
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <Select
        sizing="sm"
        className="w-56"
        aria-label="Filter by country"
        value={selected}
        onChange={(event) => onSelect(event.target.value)}
      >
        <option value="">Every country</option>
        {countries.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </Select>

      {selected !== "" && (
        <button
          type="button"
          onClick={() => onSelect("")}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <LuX className="size-3.5" />
          Show every postcard
        </button>
      )}
    </div>
  );
}
