import { Checkbox, Label, Select } from "flowbite-react";
import { useField } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { InputErrorList } from "~/components/shared/Form/InputErrorList";
import { ManagedDateTimeInputBlock } from "~/components/shared/Form/Managed/ManagedDateTimeInputBlock";
import { ManagedSelectBlock } from "~/components/shared/Form/Managed/ManagedSelectBlock";
import { ManagedTextareaBlock } from "~/components/shared/Form/Managed/ManagedTextareaBlock";
import { RequiredMark } from "~/components/shared/Form/RequiredMark";
import {
  type Airport,
  type AirportOnFlight,
  AirportOnFlightType,
  diversionReasonOptions,
  diversionSeverityOptions,
} from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

function NotificationCheckbox({ field, label }: { field: string; label: string }) {
  const [fieldProps, , helpers] = useField<boolean>(field);
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={field} checked={Boolean(fieldProps.value)} onChange={(e) => helpers.setValue(e.target.checked)} />
      <Label htmlFor={field} className="text-sm font-normal">
        {label}
      </Label>
    </div>
  );
}

function NotificationCheckboxes() {
  return (
    <div className="mb-4 w-full">
      <div className="mb-2 block">
        <Label>Notify on ground</Label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <NotificationCheckbox field="notifySecurityOnGround" label="Security" />
        <NotificationCheckbox field="notifyMedicalOnGround" label="Medical" />
        <NotificationCheckbox field="notifyFirefightersOnGround" label="Firefighters" />
      </div>
    </div>
  );
}

const FLIGHT_AIRPORT_LABEL: Record<AirportOnFlightType, string> = {
  [AirportOnFlightType.Departure]: "Departure",
  [AirportOnFlightType.Destination]: "Destination",
  [AirportOnFlightType.EtopsAlternate]: "ETOPS alternate",
  [AirportOnFlightType.DestinationAlternate]: "Destination alternate",
};

const FLIGHT_AIRPORT_ORDER: AirportOnFlightType[] = [
  AirportOnFlightType.Departure,
  AirportOnFlightType.Destination,
  AirportOnFlightType.DestinationAlternate,
  AirportOnFlightType.EtopsAlternate,
];

function formatAirportOption(airport: Airport): string {
  return `${airport.iataCode} — ${airport.city} (${airport.name})`;
}

function DiversionAirportField({
  flightAirports,
  allAirports,
}: {
  flightAirports: AirportOnFlight[];
  allAirports: Airport[];
}) {
  const [fieldProps, meta] = useField<string>("airportId");
  const isError = meta.touched && meta.error;

  const sortedFlightAirports = useMemo(
    () =>
      [...flightAirports].sort((a, b) => FLIGHT_AIRPORT_ORDER.indexOf(a.type) - FLIGHT_AIRPORT_ORDER.indexOf(b.type)),
    [flightAirports],
  );

  const otherAirports = useMemo(() => {
    const flightIds = new Set(flightAirports.map((a) => a.id));
    return allAirports.filter((a) => !flightIds.has(a.id)).sort((a, b) => a.iataCode.localeCompare(b.iataCode));
  }, [flightAirports, allAirports]);

  return (
    <div className="mb-4 w-full">
      <div className="mb-2 block">
        <Label htmlFor="airportId" color={isError ? "failure" : undefined}>
          Diversion airport
          <RequiredMark />
        </Label>
      </div>
      <Select id="airportId" color={isError ? "failure" : undefined} required {...fieldProps}>
        <option value="">— select airport —</option>
        {sortedFlightAirports.length > 0 && (
          <optgroup label="Flight airports">
            {sortedFlightAirports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {FLIGHT_AIRPORT_LABEL[airport.type]} · {formatAirportOption(airport)}
              </option>
            ))}
          </optgroup>
        )}
        {otherAirports.length > 0 && (
          <optgroup label="All airports">
            {otherAirports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {formatAirportOption(airport)}
              </option>
            ))}
          </optgroup>
        )}
      </Select>
      <InputErrorList errorFocus={Boolean(isError)} errors={isError ? [meta.error as string] : []} />
    </div>
  );
}

export function DiversionFormFields() {
  const { airportService } = useApi();
  const { flight } = useTrackedFlight();
  const [airports, setAirports] = useState<Airport[]>([]);

  useEffect(() => {
    airportService.fetchAll().then(setAirports);
  }, [airportService]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        <ManagedSelectBlock
          className="basis-1/2"
          field="severity"
          label="Severity"
          options={diversionSeverityOptions}
        />
        <ManagedSelectBlock className="basis-1/2" field="reason" label="Reason" options={diversionReasonOptions} />
      </div>

      <DiversionAirportField flightAirports={flight?.airports ?? []} allAirports={airports} />

      <div className="mb-4 w-full">
        <ManagedDateTimeInputBlock
          field="estimatedTimeAtDestination"
          label="Estimated time at diversion airport (Zulu)"
        />
      </div>

      <NotificationCheckboxes />

      <ManagedTextareaBlock
        field="freeText"
        label="Description"
        placeholder="Severe weather at destination, diverting to nearest suitable airport."
      />
    </div>
  );
}
