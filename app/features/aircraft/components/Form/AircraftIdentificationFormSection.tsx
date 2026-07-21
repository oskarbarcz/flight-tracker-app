import React, { useEffect, useState } from "react";
import { HiOutlineIdentification } from "react-icons/hi";
import { airframeSelectOptions } from "~/features/aircraft/components/Form/airframeSelectOptions";
import type { AircraftIdentityFormValues } from "~/features/aircraft/schema";
import { aircraftIdentitySchema } from "~/features/aircraft/schema";
import type { Airframe } from "~/features/airframe";
import { AdvancedSelect } from "~/shared/ui/Form/AdvancedSelect/AdvancedSelect";
import { FormSection } from "~/shared/ui/Form/FormSection";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";

type Props = {
  data: AircraftIdentityFormValues;
  airframes: Airframe[];
  defaultEditable?: boolean;
  onSubmit: (data: AircraftIdentityFormValues) => void;
};

export function AircraftIdentificationFormSection({ data, airframes, defaultEditable = true, onSubmit }: Props) {
  const [initialValues, setInitialValues] = useState<AircraftIdentityFormValues>(data);
  const [isEditable, setIsEditable] = useState<boolean>(defaultEditable);

  useEffect(() => {
    setInitialValues(data);
  }, [data]);

  const airframeOptions = airframeSelectOptions(airframes);

  return (
    <FormSection<AircraftIdentityFormValues>
      initialValues={initialValues}
      validationSchema={aircraftIdentitySchema}
      isEditable={isEditable}
      setIsEditable={setIsEditable}
      icon={HiOutlineIdentification}
      title="Identification"
      onSubmit={onSubmit}
    >
      <AdvancedSelect
        field="type"
        label="Airframe"
        placeholder="Select airframe"
        options={airframeOptions}
        disabled={!isEditable}
      />
      <ManagedFloatingInputBlock field="registration" label="Registration" disabled={!isEditable} />
      <ManagedFloatingInputBlock field="selcal" label="SELCAL" required={false} disabled={!isEditable} />
    </FormSection>
  );
}
