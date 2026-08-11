import { useFormikContext } from "formik";
import React from "react";
import { countInput, tonsInput } from "~/features/flight/components/Forms/loadsheetFields";
import { BuildUpPanel } from "~/features/flight/components/FuelAndLoadsheet/BuildUpPanel";
import { WeightsBuildUp } from "~/features/flight/components/FuelAndLoadsheet/WeightsBuildUp";
import { type FlatLoadsheetFormData, flatLoadsheetToLoadsheet } from "~/features/flight/form-types";
import { FormGrid } from "~/shared/ui/Form/FormGrid";
import { FormSectionLabel } from "~/shared/ui/Form/FormSectionLabel";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";

export function LoadsheetLoadStep() {
  const { values } = useFormikContext<FlatLoadsheetFormData>();
  const loadsheet = flatLoadsheetToLoadsheet(values);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <FormSectionLabel>Souls on board</FormSectionLabel>

        <FormGrid columns={2}>
          <ManagedFloatingInputBlock field="pilots" label="Pilots" {...countInput} />
          <ManagedFloatingInputBlock field="reliefPilots" label="Relief pilots" {...countInput} />
          <ManagedFloatingInputBlock field="cabinCrew" label="Cabin crew" {...countInput} />
          <ManagedFloatingInputBlock field="passengers" label="Passengers" {...countInput} />
        </FormGrid>
      </section>

      <section className="flex flex-col gap-4">
        <FormSectionLabel>Weight</FormSectionLabel>

        <FormGrid columns={3}>
          <ManagedFloatingInputBlock field="cargo" label="Cargo" {...tonsInput} />
          <ManagedFloatingInputBlock field="payload" label="Payload" {...tonsInput} />
          <ManagedFloatingInputBlock field="zeroFuelWeight" label="Zero-fuel weight" {...tonsInput} />
        </FormGrid>
      </section>

      <BuildUpPanel title="Weights summary">
        <WeightsBuildUp zeroFuelWeight={loadsheet.zeroFuelWeight} blockFuel={loadsheet.blockFuel} />
      </BuildUpPanel>
    </div>
  );
}
