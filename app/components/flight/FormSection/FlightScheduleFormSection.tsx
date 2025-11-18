"use client";

import React, { useEffect, useState } from "react";
import FormSection from "~/components/shared/Form/FormSection";
import ManagedDateTimeInputBlock from "~/components/shared/Form/Managed/ManagedDateTimeInputBlock";
import { CreateFlightFormData } from "~/models/form/flight.form";
import { newFlightScheduleSchema } from "~/validator/form/flight.schema";

type ScheduleFormData = CreateFlightFormData["schedule"];

type Props = {
  data: ScheduleFormData;
  onSubmit: (data: ScheduleFormData) => void;
};

export default function FlightScheduleFormSection({ data, onSubmit }: Props) {
  const [initialValues, setInitialValues] = useState<ScheduleFormData>(data);
  const [isEditable, setIsEditable] = useState<boolean>(true);

  useEffect(() => {
    setInitialValues(data);
  }, [data]);

  return (
    <FormSection<ScheduleFormData>
      initialValues={initialValues}
      validationSchema={newFlightScheduleSchema}
      isEditable={isEditable}
      setIsEditable={setIsEditable}
      title="Schedule"
      onSubmit={onSubmit}
    >
      <div className="flex shrink-0 flex-wrap gap-4">
        <ManagedDateTimeInputBlock
          className="basis-[calc(50%-0.5rem)]"
          field="offBlockTime"
          label="Off-block time [zulu]"
          autoComplete="off"
          disabled={!isEditable}
          required
        />

        <ManagedDateTimeInputBlock
          className="basis-[calc(50%-0.5rem)]"
          field="takeoffTime"
          label="Takeoff time [zulu]"
          autoComplete="off"
          disabled={!isEditable}
          required
        />

        <ManagedDateTimeInputBlock
          className="basis-[calc(50%-0.5rem)]"
          field="arrivalTime"
          label="Landing time [zulu]"
          autoComplete="off"
          disabled={!isEditable}
          required
        />

        <ManagedDateTimeInputBlock
          className="basis-[calc(50%-0.5rem)]"
          field="onBlockTime"
          label="On-block time [zulu]"
          autoComplete="off"
          disabled={!isEditable}
          required
        />
      </div>
    </FormSection>
  );
}
