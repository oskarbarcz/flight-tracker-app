import { useFormikContext } from "formik";
import React from "react";
import { DerivedField } from "~/features/flight/components/Forms/DerivedField";
import { FuelTonsInput } from "~/features/flight/components/Forms/FuelTonsInput";
import { type FlatLoadsheetFormData, flatLoadsheetToLoadsheet } from "~/features/flight/form-types";
import type { Timesheet } from "~/features/flight/model";
import { durationMinutes, formatDuration } from "~/shared/lib/time";
import { FormGrid } from "~/shared/ui/Form/FormGrid";
import { FormSectionLabel } from "~/shared/ui/Form/FormSectionLabel";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";

type Props = {
  timesheet: Timesheet;
};

export function LoadsheetFuelStep({ timesheet }: Props) {
  const { values } = useFormikContext<FlatLoadsheetFormData>();
  const loadsheet = flatLoadsheetToLoadsheet(values);
  const schedule = timesheet.estimated ?? timesheet.scheduled;
  const blockTime = formatDuration(durationMinutes(schedule.offBlockTime, schedule.onBlockTime));
  const taxiTime = formatDuration(durationMinutes(schedule.offBlockTime, schedule.takeoffTime));

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <FormSectionLabel>Minimum operational fuel</FormSectionLabel>

        <FormGrid columns={3}>
          <FuelTonsInput field="trip" label="Trip" footnote={`block: ${blockTime}`} />
          <FuelTonsInput field="taxi" label="Taxi" footnote={`taxi: ${taxiTime}`} />
          <FuelTonsInput field="alternate" label="Alternate" />
          <ManagedFloatingInputBlock
            field="contingencyType"
            label="Contingency rule"
            autoComplete="off"
            required={false}
          />
          <FuelTonsInput field="contingencyAmount" label="Contingency" />
          <FuelTonsInput field="reserve" label="Final reserve" />
        </FormGrid>
      </section>

      <section className="flex flex-col gap-4">
        <FormSectionLabel>Additional fuel</FormSectionLabel>

        <FormGrid columns={3}>
          <FuelTonsInput field="extra" label="Extra" />
          <FuelTonsInput field="mel" label="MEL" />
          <FuelTonsInput field="atc" label="ATC" />
          <FuelTonsInput field="wxx" label="Weather" />
          <FuelTonsInput field="etops" label="ETOPS" required={false} />
          <FuelTonsInput field="tankering" label="Tankering" />
        </FormGrid>
      </section>

      <section className="flex flex-col gap-4">
        <FormSectionLabel>Aircraft fuel performance</FormSectionLabel>

        <FormGrid columns={2}>
          <ManagedFloatingInputBlock
            field="averageFuelFlow"
            label="Average fuel flow"
            type="number"
            autoComplete="off"
            required={false}
            unit="tons / hour"
            decimals={2}
            footnote="at 1500ft AGL, 250kt IAS, est. LW"
          />
          <FuelTonsInput field="maxTanks" label="Max tank capacity" required={false} />
        </FormGrid>
      </section>

      <DerivedField label="Block fuel" value={loadsheet.blockFuel} />
    </div>
  );
}
