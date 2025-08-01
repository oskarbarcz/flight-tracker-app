"use client";

import FormSection from "~/components/Form/FormSection";
import React, { useState } from "react";
import ManagedInputBlock from "~/components/Intrinsic/Form/Managed/ManagedInputBlock";

export type AirportGeneralFormData = {
  iataCode: string;
  icaoCode: string;
  name: string;
};

type AirportGeneralFormSectionProps = {
  data: AirportGeneralFormData;
  onSubmit: (data: AirportGeneralFormData) => void;
};

export default function AirportGeneralFormSection({
  data,
  onSubmit,
}: AirportGeneralFormSectionProps) {
  const [isEditable, setIsEditable] = useState<boolean>(true);

  return (
    <FormSection<AirportGeneralFormData>
      initialValues={data}
      isEditable={isEditable}
      setIsEditable={setIsEditable}
      title="General"
      onSubmit={onSubmit}
    >
      <div className="flex gap-4">
        <div className="basis-1/4">
          <ManagedInputBlock
            field="iataCode"
            label="IATA code"
            disabled={!isEditable}
          />
        </div>
        <div className="basis-1/4">
          <ManagedInputBlock
            field="icaoCode"
            label="ICAO code"
            disabled={!isEditable}
          />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock
            field="name"
            label="Airport name"
            disabled={!isEditable}
          />
        </div>
      </div>
    </FormSection>
  );
}
