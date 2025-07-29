"use client";

import FormSection from "~/components/Form/Section/FormSection";
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
  setData: (data: AirportLocationData) => void;
  setIsSubmittable: (isSubmittable: boolean) => void;
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
  setData,
  setIsSubmittable,
}: AirportLocationFormSectionProps) {
  const [editable, setEditable] = useState<boolean>(true);
  const [formData, setFormData] = useState<AirportLocationData>(data);

  useEffect(() => {
    setFormData(data);

    if (data.city !== "") {
      // when filled with SkyLink, set as submitted
      setEditable(false);
      setIsSubmittable(true);
    }
  }, [data, setIsSubmittable]);

  const handleSave = (setEditMode: boolean) => {
    setEditable(setEditMode);

    if (!setEditMode) {
      // when clicked “Save”, set as submitted
      setData(formData);
      setIsSubmittable(true);
    }
  };

  return (
    <FormSection title="Location" editMode={editable} setEditMode={handleSave}>
      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock
            htmlName="city"
            label="City"
            value={formData.city}
            setValue={(city) => setFormData((prev) => ({ ...prev, city }))}
            disabled={!editable}
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
            disabled={!editable}
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
            disabled={!editable}
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
            disabled={!editable}
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
            disabled={!editable}
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
            disabled={!editable}
          />
        </div>
      </div>
    </FormSection>
  );
}
