import { Label, Select } from "flowbite-react";
import { useField } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { InputErrorList } from "~/components/shared/Form/InputErrorList";
import { RequiredMark } from "~/components/shared/Form/RequiredMark";
import type { Airport } from "~/models";
import { useApi } from "~/state/api/context/useApi";

type Props = {
  excludeAirportId?: string;
};

function formatAirportOption(airport: Airport): string {
  return `${airport.iataCode} — ${airport.city} (${airport.name})`;
}

export function TravelDestinationField({ excludeAirportId }: Props) {
  const { airportService } = useApi();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [fieldProps, meta] = useField<string>("destinationAirportId");
  const isError = meta.touched && meta.error;

  useEffect(() => {
    airportService.fetchAll().then(setAirports);
  }, [airportService]);

  const selectableAirports = useMemo(
    () =>
      airports
        .filter((airport) => airport.id !== excludeAirportId)
        .sort((a, b) => a.iataCode.localeCompare(b.iataCode)),
    [airports, excludeAirportId],
  );

  return (
    <div className="mb-4 w-full">
      <div className="mb-2 block">
        <Label htmlFor="destinationAirportId" color={isError ? "failure" : undefined}>
          Destination airport
          <RequiredMark />
        </Label>
      </div>
      <Select id="destinationAirportId" color={isError ? "failure" : undefined} required {...fieldProps}>
        <option value="">— select airport —</option>
        {selectableAirports.map((airport) => (
          <option key={airport.id} value={airport.id}>
            {formatAirportOption(airport)}
          </option>
        ))}
      </Select>
      <InputErrorList errorFocus={Boolean(isError)} errors={isError ? [meta.error as string] : []} />
    </div>
  );
}
