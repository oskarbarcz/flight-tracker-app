import { Select, TextInput } from "flowbite-react";
import React from "react";
import { LuX } from "react-icons/lu";

export type CatalogueFilters = {
  airline: string;
  aircraftType: string;
  status: string;
};

type Props = {
  filters: CatalogueFilters;
  isFiltering: boolean;
  onChange: (name: keyof CatalogueFilters, value: string) => void;
  onClear: () => void;
};

export function CatalogueToolbar({ filters, isFiltering, onChange, onClear }: Props) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <TextInput
        sizing="sm"
        className="w-32"
        maxLength={2}
        aria-label="Filter by airline code"
        placeholder="Airline"
        value={filters.airline}
        onChange={(event) => onChange("airline", event.target.value.toUpperCase())}
      />
      <TextInput
        sizing="sm"
        className="w-40"
        maxLength={6}
        aria-label="Filter by aircraft type code"
        placeholder="Aircraft type"
        value={filters.aircraftType}
        onChange={(event) => onChange("aircraftType", event.target.value.toUpperCase())}
      />
      <Select
        sizing="sm"
        className="w-44"
        aria-label="Filter by status"
        value={filters.status}
        onChange={(event) => onChange("status", event.target.value)}
      >
        <option value="">All layouts</option>
        <option value="false">Actively in use</option>
        <option value="true">Withdrawn</option>
      </Select>

      {isFiltering && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <LuX className="size-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
