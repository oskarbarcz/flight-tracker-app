"use client";

import FormSection from "~/components/Form/FormSection";
import React, { useEffect, useState } from "react";
import ManagedInputBlock from "~/components/Intrinsic/Form/Managed/ManagedInputBlock";
import { createAirportGeneralSchema } from "~/validator/form/create-airport.schema";

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
  const [initialValues, setInitialValues] =
    useState<AirportGeneralFormData>(data);
  const [isEditable, setIsEditable] = useState<boolean>(true);

  useEffect(() => {
    setInitialValues(data);
  }, [data]);

  return (
    <FormSection<AirportGeneralFormData>
      initialValues={initialValues}
      validationSchema={createAirportGeneralSchema}
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
