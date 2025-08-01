"use client";

import FormSection from "~/components/Form/FormSection";
import React, { useState } from "react";
import ManagedSelectBlock from "~/components/Intrinsic/Form/Managed/ManagedSelectBlock";
import ManagedInputBlock from "~/components/Intrinsic/Form/Managed/ManagedInputBlock";
import { Continent } from "~/models";

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
