"use client";

import FormSection from "~/components/Form/FormSection";
import React, { useEffect, useState } from "react";
import ManagedSelectBlock from "~/components/Intrinsic/Form/Managed/ManagedSelectBlock";
import { useApi } from "~/state/contexts/content/api.context";
import { Airport } from "~/models";
import { CreateFlightFormData } from "~/models/form/flight.form";
import { newFlightRouteSchema } from "~/validator/form/flight.schema";

type FlightRouteFormData = CreateFlightFormData["route"];

type Props = {
  data: FlightRouteFormData;
  onSubmit: (data: FlightRouteFormData) => void;
};

function optionsFromAirports(airports: Airport[]) {
  return airports.map((airport) => ({
    label: `${airport.iataCode} - ${airport.city}`,
    value: airport.id,
  }));
}

export default function FlightRouteFormSection({ data, onSubmit }: Props) {
  const [initialValues, setInitialValues] = useState<FlightRouteFormData>(data);
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [airports, setAirports] = useState<Airport[]>([]);
  const { airportService } = useApi();

  useEffect(() => {
    setInitialValues(data);
  }, [data]);

  useEffect(() => {
    airportService.getAll().then(setAirports);
  }, [airportService]);

  return (
    <FormSection<FlightRouteFormData>
      initialValues={initialValues}
      validationSchema={newFlightRouteSchema}
      isEditable={isEditable}
      setIsEditable={setIsEditable}
      title="Route"
      onSubmit={onSubmit}
    >
      <div className="flex gap-4">
        <ManagedSelectBlock
          className="basis-[calc(50%-0.5rem)]"
          field="departureAirportId"
          label="Departure"
          disabled={!isEditable}
          options={optionsFromAirports(airports)}
        />
        <ManagedSelectBlock
          className="basis-[calc(50%-0.5rem)]"
          field="destinationAirportId"
          label="Destination"
          disabled={!isEditable}
          options={optionsFromAirports(airports)}
        />
      </div>
    </FormSection>
  );
}
