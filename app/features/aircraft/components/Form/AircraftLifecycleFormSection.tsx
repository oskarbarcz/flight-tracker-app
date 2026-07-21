import React, { useEffect, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { etopsThresholdSelectOptions } from "~/features/aircraft/components/Form/etopsThresholdSelectOptions";
import type { AircraftLifecycleFormValues } from "~/features/aircraft/schema";
import { aircraftLifecycleSchema } from "~/features/aircraft/schema";
import type { Airport } from "~/features/airport";
import { airportSelectOptions } from "~/features/airport/components/Airport/airportSelectOptions";
import { AdvancedSelect } from "~/shared/ui/Form/AdvancedSelect/AdvancedSelect";
import { FormSection } from "~/shared/ui/Form/FormSection";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";

type Props = {
  data: AircraftLifecycleFormValues;
  airports: Airport[];
  defaultEditable?: boolean;
  onSubmit: (data: AircraftLifecycleFormValues) => void;
};

export function AircraftLifecycleFormSection({ data, airports, defaultEditable = true, onSubmit }: Props) {
  const [initialValues, setInitialValues] = useState<AircraftLifecycleFormValues>(data);
  const [isEditable, setIsEditable] = useState<boolean>(defaultEditable);

  useEffect(() => {
    setInitialValues(data);
  }, [data]);

  const airportOptions = airportSelectOptions(airports);

  return (
    <FormSection<AircraftLifecycleFormValues>
      initialValues={initialValues}
      validationSchema={aircraftLifecycleSchema}
      isEditable={isEditable}
      setIsEditable={setIsEditable}
      icon={HiOutlineRefresh}
      title="Lifecycle"
      onSubmit={onSubmit}
    >
      <AdvancedSelect
        field="baseAirportId"
        label="Base airport"
        placeholder="Select base airport"
        options={airportOptions}
        disabled={!isEditable}
      />
      <ManagedFloatingInputBlock field="livery" label="Livery name" required={false} disabled={!isEditable} />
      <AdvancedSelect
        field="etopsThresholdMinutes"
        label="ETOPS threshold"
        options={etopsThresholdSelectOptions}
        required={false}
        clearable={false}
        disabled={!isEditable}
      />
    </FormSection>
  );
}
