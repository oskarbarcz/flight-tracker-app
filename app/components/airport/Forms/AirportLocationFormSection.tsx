"use client";

import FormSection from "~/components/shared/Form/FormSection";
import React, { useState } from "react";
import { Continent } from "~/models";
import { createAirportLocationSchema } from "~/validator/form/create-airport.schema";
import ManagedInputBlock from "~/components/shared/Form/Managed/ManagedInputBlock";
import ManagedSelectBlock from "~/components/shared/Form/Managed/ManagedSelectBlock";

export type AirportLocationData = {
  city: string;
  country: string;
  timezone: string;
  continent: Continent;
  latitude: number;
  longitude: number;
};

type AirportLocationFormSectionProps = {
  data: AirportLocationData;
  onSubmit: (data: AirportLocationData) => void;
};

const continentOptions = [
  { label: "Europe", value: Continent.Europe },
  { label: "North America", value: Continent.NorthAmerica },
  { label: "South America", value: Continent.SouthAmerica },
  { label: "Oceania", value: Continent.Oceania },
  { label: "Asia", value: Continent.Asia },
  { label: "Africa", value: Continent.Africa },
];

export default function AirportLocationFormSection({
  data,
  onSubmit,
}: AirportLocationFormSectionProps) {
  const [isEditable, setIsEditable] = useState<boolean>(true);

  return (
    <FormSection<AirportLocationData>
      initialValues={data}
      validationSchema={createAirportLocationSchema}
      isEditable={isEditable}
      setIsEditable={setIsEditable}
      title="Location"
      onSubmit={onSubmit}
    >
      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock field="city" label="City" disabled={!isEditable} />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock
            field="country"
            label="Country"
            disabled={!isEditable}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock
            field="timezone"
            label="Timezone"
            disabled={!isEditable}
          />
        </div>
        <div className="basis-1/2">
          <ManagedSelectBlock
            field="continent"
            label="Continent"
            options={continentOptions}
            disabled={!isEditable}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock
            field="longitude"
            label="Longitude"
            disabled={!isEditable}
          />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock
            field="latitude"
            label="Latitude"
            disabled={!isEditable}
          />
        </div>
      </div>
    </FormSection>
  );
}
