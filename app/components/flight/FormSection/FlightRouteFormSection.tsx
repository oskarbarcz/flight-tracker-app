import React, { useEffect, useState } from "react";
import { FaRoute } from "react-icons/fa6";
import { AirportShape } from "~/components/shared/Airport/AirportShape";
import { AdvancedSelect, type AdvancedSelectOption } from "~/components/shared/Form/AdvancedSelect/AdvancedSelect";
import { OptionAvatarFrame } from "~/components/shared/Form/AdvancedSelect/OptionAvatarFrame";
import { FormSection } from "~/components/shared/Form/FormSection";
import type { Airport } from "~/models";
import type { CreateFlightFormData } from "~/models/form/flight.form";
import { useApi } from "~/state/api/context/useApi";
import { newFlightRouteSchema } from "~/validator/form/flight.schema";

type FlightRouteFormData = CreateFlightFormData["route"];

type Props = {
  data: FlightRouteFormData;
  onSubmit: (data: FlightRouteFormData) => void;
};

function airportSelectOptions(airports: Airport[]): AdvancedSelectOption[] {
  return airports.map((airport) => ({
    value: airport.id,
    keywords: [airport.iataCode, airport.icaoCode, airport.city, airport.name],
    avatar: (
      <OptionAvatarFrame>
        <AirportShape shape={airport.shape} />
      </OptionAvatarFrame>
    ),
    title: airport.name,
    subtitle: `${airport.city}, ${airport.country}`,
    selectedSubtitle: (
      <>
        IATA: <span className="font-semibold">{airport.iataCode}</span>, ICAO:{" "}
        <span className="font-semibold">{airport.icaoCode}</span>
      </>
    ),
  }));
}

export function FlightRouteFormSection({ data, onSubmit }: Props) {
  const [initialValues, setInitialValues] = useState<FlightRouteFormData>(data);
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [airports, setAirports] = useState<Airport[]>([]);
  const { airportService } = useApi();

  useEffect(() => {
    setInitialValues(data);
  }, [data]);

  useEffect(() => {
    airportService.fetchAll().then(setAirports);
  }, [airportService]);

  const options = airportSelectOptions(airports);

  return (
    <FormSection<FlightRouteFormData>
      initialValues={initialValues}
      validationSchema={newFlightRouteSchema}
      isEditable={isEditable}
      setIsEditable={setIsEditable}
      icon={FaRoute}
      title="Route"
      onSubmit={onSubmit}
    >
      <div className="flex flex-wrap gap-4">
        <AdvancedSelect
          className="basis-[calc(50%-0.5rem)]"
          field="departureAirportId"
          label="Departure"
          placeholder="Select departure"
          disabled={!isEditable}
          options={options}
        />
        <AdvancedSelect
          className="basis-[calc(50%-0.5rem)]"
          field="destinationAirportId"
          label="Destination"
          placeholder="Select destination"
          disabled={!isEditable}
          options={options}
        />
      </div>
    </FormSection>
  );
}
