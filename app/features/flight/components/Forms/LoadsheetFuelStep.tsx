import { useFormikContext } from "formik";
import React from "react";
import { tonsInput } from "~/features/flight/components/Forms/loadsheetFields";
import { BuildUpPanel } from "~/features/flight/components/FuelAndLoadsheet/BuildUpPanel";
import { FuelPlan } from "~/features/flight/components/FuelAndLoadsheet/FuelPlan";
import { type FlatLoadsheetFormData, flatLoadsheetToLoadsheet } from "~/features/flight/form-types";
import { FormGrid } from "~/shared/ui/Form/FormGrid";
import { FormSectionLabel } from "~/shared/ui/Form/FormSectionLabel";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";

export function LoadsheetFuelStep() {
  const { values } = useFormikContext<FlatLoadsheetFormData>();
  const loadsheet = flatLoadsheetToLoadsheet(values);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <FormSectionLabel>Fuel on board</FormSectionLabel>

        <FormGrid columns={3}>
          <ManagedFloatingInputBlock field="trip" label="Trip" {...tonsInput} />
          <ManagedFloatingInputBlock field="taxi" label="Taxi" {...tonsInput} />
          <ManagedFloatingInputBlock field="alternate" label="Alternate" {...tonsInput} />
          <ManagedFloatingInputBlock
            field="contingencyType"
            label="Contingency rule"
            autoComplete="off"
            required={false}
          />
          <ManagedFloatingInputBlock field="contingencyAmount" label="Contingency" {...tonsInput} />
          <ManagedFloatingInputBlock field="reserve" label="Final reserve" {...tonsInput} />
        </FormGrid>
      </section>

      <section className="flex flex-col gap-4">
        <FormSectionLabel>Additional fuel</FormSectionLabel>

        <FormGrid columns={3}>
          <ManagedFloatingInputBlock field="extra" label="Extra" {...tonsInput} />
          <ManagedFloatingInputBlock field="mel" label="MEL" {...tonsInput} />
          <ManagedFloatingInputBlock field="atc" label="ATC" {...tonsInput} />
          <ManagedFloatingInputBlock field="wxx" label="Weather" {...tonsInput} />
          <ManagedFloatingInputBlock field="etops" label="ETOPS" required={false} {...tonsInput} />
          <ManagedFloatingInputBlock field="tankering" label="Tankering" {...tonsInput} />
        </FormGrid>
      </section>

      <section className="flex flex-col gap-4">
        <FormSectionLabel>Performance</FormSectionLabel>

        <FormGrid columns={2}>
          <ManagedFloatingInputBlock
            field="averageFuelFlow"
            label="Average fuel flow"
            type="number"
            autoComplete="off"
            required={false}
            unit="tons / hour"
            decimals={2}
          />
          <ManagedFloatingInputBlock field="maxTanks" label="Max tank capacity" required={false} {...tonsInput} />
        </FormGrid>
      </section>

      <BuildUpPanel title="Fuel summary">
        <FuelPlan fuel={loadsheet.fuel} />
      </BuildUpPanel>
    </div>
  );
}
