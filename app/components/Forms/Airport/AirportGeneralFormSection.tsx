"use client";

import FormSection from "~/components/Form/Section/FormSection";
import React, { useEffect, useState } from "react";
import ManagedInputBlock from "~/components/Intrinsic/Form/Managed/ManagedInputBlock";

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

    if (data.iataCode !== "") {
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
    <FormSection title="General" editMode={editable} setEditMode={handleSave}>
      <div className="flex gap-4">
        <div className="basis-1/4">
          <ManagedInputBlock
            htmlName="iataCode"
            label="IATA code"
            value={formData.iataCode}
            setValue={(iataCode) =>
              setFormData((prev) => ({ ...prev, iataCode }))
            }
            disabled={!editable}
          />
        </div>
        <div className="basis-1/4">
          <ManagedInputBlock
            htmlName="icaoCode"
            label="ICAO code"
            value={formData.icaoCode}
            setValue={(icaoCode) =>
              setFormData((prev) => ({ ...prev, icaoCode }))
            }
            disabled={!editable}
          />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock
            htmlName="name"
            label="Airport name"
            value={formData.name}
            setValue={(name) => setFormData((prev) => ({ ...prev, name }))}
            disabled={!editable}
          />
        </div>
      </div>
    </FormSection>
  );
}
