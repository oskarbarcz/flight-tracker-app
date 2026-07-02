import React, { useEffect, useState } from "react";
import { FaRegCalendar } from "react-icons/fa6";
import type { CreateFlightFormData } from "~/features/flight/form";
import { newFlightScheduleSchema } from "~/features/flight/schema";
import { FormSection } from "~/shared/ui/Form/FormSection";
import { ManagedDateTimeInputBlock } from "~/shared/ui/Form/Managed/ManagedDateTimeInputBlock";

type ScheduleFormData = CreateFlightFormData["schedule"];

type Props = {
  data: ScheduleFormData;
  onSubmit: (data: ScheduleFormData) => void;
};

export function FlightScheduleFormSection({ data, onSubmit }: Props) {
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
      icon={FaRegCalendar}
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
