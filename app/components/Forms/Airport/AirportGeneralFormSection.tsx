"use client";

import FormSection from "~/components/Form/FormSection";
import React, { useEffect, useState } from "react";
import ManagedInputBlock from "~/components/Intrinsic/Form/Managed/ManagedInputBlock";

export type AirportGeneralFormData = {
  iataCode: string;
  icaoCode: string;
  name: string;
};

type AirportGeneralFormSectionProps = {
  data: AirportGeneralFormData;
  onSectionSubmit: (data: AirportGeneralFormData) => void;
};

export default function AirportGeneralFormSection({
  data,
  onSectionSubmit,
}: AirportGeneralFormSectionProps) {
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [formData, setFormData] = useState<AirportGeneralFormData>(data);

  useEffect(() => {
    setFormData(data);

    if (data.iataCode !== "") {
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
      title="General"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-4">
        <div className="basis-1/4">
          <ManagedInputBlock
            htmlName="iataCode"
            label="IATA code"
            value={formData.iataCode}
            setValue={(iataCode) =>
              setFormData((prev) => ({ ...prev, iataCode }))
            }
            disabled={!isEditable}
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
            disabled={!isEditable}
          />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock
            htmlName="name"
            label="Airport name"
            value={formData.name}
            setValue={(name) => setFormData((prev) => ({ ...prev, name }))}
            disabled={!isEditable}
          />
        </div>
      </div>
    </FormSection>
  );
}
