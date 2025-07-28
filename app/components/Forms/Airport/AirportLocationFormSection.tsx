"use client";

import DisplayInputBlock from "~/components/Intrinsic/Form/DisplayInputBlock";
import FormSection from "~/components/Intrinsic/Form/FormSection";
import React, { useEffect, useState } from "react";

type AirportLocationData = {
  city: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
};

type AirportLocationFormSectionProps = {
  data: AirportLocationData;
  setData: (data: AirportLocationData) => void;
  setIsSubmittable: (isSubmittable: boolean) => void;
};

export default function AirportLocationFormSection({
  data,
  setData,
  setIsSubmittable,
}: AirportLocationFormSectionProps) {
  const [editable, setEditable] = useState<boolean>(true);
  const [formData, setFormData] = useState<AirportLocationData>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSave = (setEditMode: boolean) => {
    setEditable(setEditMode);
    if (!setEditMode) {
      // on save
      setData(formData);
      setIsSubmittable(true);
    }
  };

  return (
    <FormSection title="Location" editMode={editable} setEditMode={handleSave}>
      <div className="flex gap-4">
        <div className="basis-1/2">
          <DisplayInputBlock
            htmlName="city"
            label="City"
            value={formData.city}
            setValue={(city) => setFormData((prev) => ({ ...prev, city }))}
            isEditable={editable}
          />
        </div>
        <div className="basis-1/2">
          <DisplayInputBlock
            htmlName="country"
            label="Country"
            value={formData.country}
            setValue={(country) =>
              setFormData((prev) => ({ ...prev, country }))
            }
            isEditable={editable}
          />
        </div>
      </div>
      <DisplayInputBlock
        htmlName="timezone"
        label="Timezone"
        value={formData.timezone}
        setValue={(timezone) => setFormData((prev) => ({ ...prev, timezone }))}
        isEditable={editable}
      />
      <div className="flex gap-4">
        <div className="basis-1/2">
          <DisplayInputBlock
            htmlName="longitude"
            label="Longitude"
            value={formData.longitude.toString()}
            setValue={(longitude) =>
              setFormData((prev) => ({
                ...prev,
                longitude: parseFloat(longitude),
              }))
            }
            isEditable={editable}
          />
        </div>
        <div className="basis-1/2">
          <DisplayInputBlock
            htmlName="latitude"
            label="Latitude"
            value={formData.latitude.toString()}
            setValue={(latitude) =>
              setFormData((prev) => ({
                ...prev,
                latitude: parseFloat(latitude),
              }))
            }
            isEditable={editable}
          />
        </div>
      </div>
    </FormSection>
  );
}
