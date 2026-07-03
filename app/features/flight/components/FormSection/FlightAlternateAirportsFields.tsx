import { Label } from "flowbite-react";
import { FieldArray, useField } from "formik";
import React, { useState } from "react";
import { FaPlus, FaXmark } from "react-icons/fa6";
import type { DestinationAlternateEntry } from "~/features/flight/form";
import { AdvancedSelect, type AdvancedSelectOption } from "~/shared/ui/Form/AdvancedSelect/AdvancedSelect";

const MAX_DESTINATION_ALTERNATES = 5;

type Props = {
  options: AdvancedSelectOption[];
  disabled: boolean;
};

type RowProps = {
  index: number;
  options: AdvancedSelectOption[];
  disabled: boolean;
  onRemove: () => void;
};

function DestinationAlternateRow({ index, options, disabled, onRemove }: RowProps) {
  return (
    <div className="flex items-start gap-2">
      <AdvancedSelect
        className="flex-1"
        field={`destinationAlternates.${index}.airportId`}
        label={`Alternate airport ${index + 1}`}
        placeholder="Select alternate airport"
        disabled={disabled}
        options={options}
      />
      <div className="shrink-0">
        <div className="mb-2 block">
          <Label className="invisible">Remove</Label>
        </div>
        <button
          type="button"
          aria-label={`Remove alternate airport ${index + 1}`}
          onClick={onRemove}
          disabled={disabled}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
        >
          <FaXmark className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function FlightAlternateAirportsFields({ options, disabled }: Props) {
  const [{ value: destinationAlternates }] = useField<DestinationAlternateEntry[]>("destinationAlternates");
  const [{ value: etopsEntryAirportId }] = useField<string>("etopsEntryAirportId");
  const [{ value: etopsExitAirportId }] = useField<string>("etopsExitAirportId");
  const [{ value: enrouteAlternateAirportId }] = useField<string>("enrouteAlternateAirportId");

  const hasAlternates =
    destinationAlternates.length > 0 ||
    etopsEntryAirportId !== "" ||
    etopsExitAirportId !== "" ||
    enrouteAlternateAirportId !== "";

  const [isExpanded, setIsExpanded] = useState<boolean>(hasAlternates);

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        disabled={disabled}
        className="flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-indigo-400"
      >
        <FaPlus className="h-3 w-3" />
        Add alternate airports
      </button>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Destination alternates
        </span>
        <FieldArray name="destinationAlternates">
          {({ push, remove }) => (
            <div className="flex flex-col">
              {destinationAlternates.map((alternate, index) => (
                <DestinationAlternateRow
                  key={alternate.id}
                  index={index}
                  options={options}
                  disabled={disabled}
                  onRemove={() => remove(index)}
                />
              ))}
              {destinationAlternates.length < MAX_DESTINATION_ALTERNATES && (
                <button
                  type="button"
                  onClick={() => push({ id: crypto.randomUUID(), airportId: "" })}
                  disabled={disabled}
                  className="flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-indigo-400"
                >
                  <FaPlus className="h-3 w-3" />
                  Add alternate
                </button>
              )}
            </div>
          )}
        </FieldArray>
      </div>

      <div className="flex flex-wrap gap-4">
        <AdvancedSelect
          className="basis-[calc(50%-0.5rem)]"
          field="etopsEntryAirportId"
          label="ETOPS entry alternate"
          placeholder="Select ETOPS entry"
          required={false}
          disabled={disabled}
          options={options}
        />
        <AdvancedSelect
          className="basis-[calc(50%-0.5rem)]"
          field="etopsExitAirportId"
          label="ETOPS exit alternate"
          placeholder="Select ETOPS exit"
          required={false}
          disabled={disabled}
          options={options}
        />
      </div>

      <AdvancedSelect
        field="enrouteAlternateAirportId"
        label="Enroute alternate"
        placeholder="Select enroute alternate"
        required={false}
        disabled={disabled}
        options={options}
      />
    </>
  );
}
