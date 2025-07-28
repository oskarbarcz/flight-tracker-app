"use client";

import DisplayInputBlock from "~/components/Intrinsic/Form/DisplayInputBlock";
import FormSection from "~/components/Intrinsic/Form/FormSection";
import React, { useEffect, useState } from "react";

type AirportGeneralData = {
  iataCode: string;
  icaoCode: string;
  name: string;
};

type AirportGeneralFormSectionProps = {
  data: AirportGeneralData;
  setData: (data: AirportGeneralData) => void;
  setIsSubmittable: (isSubmittable: boolean) => void;
};

export default function AirportGeneralFormSection({
  data,
  setData,
  setIsSubmittable,
}: AirportGeneralFormSectionProps) {
  const [editable, setEditable] = useState<boolean>(true);
  const [formData, setFormData] = useState<AirportGeneralData>(data);

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
    <FormSection title="General" editMode={editable} setEditMode={handleSave}>
      <div className="flex gap-4">
        <div className="basis-1/4">
          <DisplayInputBlock
            htmlName="iataCode"
            label="IATA code"
            value={formData.iataCode}
            setValue={(iataCode) =>
              setFormData((prev) => ({ ...prev, iataCode }))
            }
            isEditable={editable}
          />
        </div>
        <div className="basis-1/4">
          <DisplayInputBlock
            htmlName="icaoCode"
            label="ICAO code"
            value={formData.icaoCode}
            setValue={(icaoCode) =>
              setFormData((prev) => ({ ...prev, icaoCode }))
            }
            isEditable={editable}
          />
        </div>
        <div className="basis-1/2">
          <DisplayInputBlock
            htmlName="name"
            label="Airport name"
            value={formData.name}
            setValue={(name) => setFormData((prev) => ({ ...prev, name }))}
            isEditable={editable}
          />
        </div>
      </div>
    </FormSection>
  );
}
