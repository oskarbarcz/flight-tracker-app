"use client";

import FormSection from "~/components/Form/FormSection";
import React, { useEffect, useState } from "react";
import ManagedSelectBlock from "~/components/Intrinsic/Form/Managed/ManagedSelectBlock";
import ManagedInputBlock from "~/components/Intrinsic/Form/Managed/ManagedInputBlock";
import { Continent } from "~/models";

type AirportLocationData = {
  city: string;
  country: string;
  timezone: string;
  continent: string;
  latitude: number;
  longitude: number;
};

type AirportLocationFormSectionProps = {
  data: AirportLocationData;
  onSectionSubmit: (formData: AirportLocationData) => void;
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
  onSectionSubmit,
}: AirportLocationFormSectionProps) {
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [formData, setFormData] = useState<AirportLocationData>(data);

  useEffect(() => {
    setFormData(data);

    if (data.city !== "") {
      // when filled with SkyLink, set as submitted
      setIsEditable(false);
    }
  }, [data]);

  const handleSubmit = () => {
    onSectionSubmit(formData);
  };

  return (
    <FormSection
      isEditable={isEditable}
      setIsEditable={setIsEditable}
      title="Location"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock
            htmlName="city"
            label="City"
            value={formData.city}
            setValue={(city) => setFormData((prev) => ({ ...prev, city }))}
            disabled={!isEditable}
          />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock
            htmlName="country"
            label="Country"
            value={formData.country}
            setValue={(country) =>
              setFormData((prev) => ({ ...prev, country }))
            }
            disabled={!isEditable}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock
            htmlName="timezone"
            label="Timezone"
            value={formData.timezone}
            setValue={(timezone) =>
              setFormData((prev) => ({ ...prev, timezone }))
            }
            disabled={!isEditable}
          />
        </div>
        <div className="basis-1/2">
          <ManagedSelectBlock
            htmlName="continent"
            label="Continent"
            value={formData.continent}
            setValue={(continent) =>
              setFormData((prev) => ({ ...prev, continent }))
            }
            options={continentOptions}
            disabled={!isEditable}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock
            htmlName="longitude"
            label="Longitude"
            value={formData.longitude.toString()}
            setValue={(longitude) =>
              setFormData((prev) => ({
                ...prev,
                longitude: parseFloat(longitude),
              }))
            }
            disabled={!isEditable}
          />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock
            htmlName="latitude"
            label="Latitude"
            value={formData.latitude.toString()}
            setValue={(latitude) =>
              setFormData((prev) => ({
                ...prev,
                latitude: parseFloat(latitude),
              }))
            }
            disabled={!isEditable}
          />
        </div>
      </div>
    </FormSection>
  );
}
