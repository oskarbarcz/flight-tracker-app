import { useFormikContext } from "formik";
import React from "react";
import { HiExclamationTriangle } from "react-icons/hi2";
import type { FlightServiceType } from "~/features/flight";
import { CabinCapacityHint } from "~/features/flight/components/Forms/CabinCapacityHint";
import { countInput, tonsInput } from "~/features/flight/components/Forms/loadsheetFields";
import { BuildUpPanel } from "~/features/flight/components/FuelAndLoadsheet/BuildUpPanel";
import { WeightsBuildUp } from "~/features/flight/components/FuelAndLoadsheet/WeightsBuildUp";
import { type FlatLoadsheetFormData, flatLoadsheetToLoadsheet } from "~/features/flight/form-types";
import type { CabinCapacity } from "~/features/flight/hooks/useCabinCapacity";
import { occupantsLabel } from "~/features/flight/lib/occupants";
import { toHuman } from "~/i18n/translate";
import { FormGrid } from "~/shared/ui/Form/FormGrid";
import { FormSectionLabel } from "~/shared/ui/Form/FormSectionLabel";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";

type Props = {
  serviceType: FlightServiceType;
  capacity: CabinCapacity | null;
};

export function LoadsheetLoadStep({ serviceType, capacity }: Props) {
  const { values, errors } = useFormikContext<FlatLoadsheetFormData>();
  const loadsheet = flatLoadsheetToLoadsheet(values);
  const splitError = typeof errors.passengersByCabin === "string" ? errors.passengersByCabin : null;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <FormSectionLabel>Souls on board</FormSectionLabel>

        <FormGrid columns={2}>
          <ManagedFloatingInputBlock field="pilots" label="Pilots" {...countInput} />
          <ManagedFloatingInputBlock field="reliefPilots" label="Relief pilots" {...countInput} />
          <ManagedFloatingInputBlock field="cabinCrew" label="Cabin crew" {...countInput} />
          <ManagedFloatingInputBlock
            field="passengers"
            label={occupantsLabel(serviceType)}
            description={
              capacity === null ? undefined : (
                <CabinCapacityHint capacity={capacity} passengers={Number(values.passengers)} />
              )
            }
            {...countInput}
          />
        </FormGrid>
      </section>

      {capacity !== null && capacity.cabins.length > 0 && (
        <section className="flex flex-col gap-4">
          <FormSectionLabel>Passengers by cabin</FormSectionLabel>

          <FormGrid columns={2}>
            {capacity.cabins.map(({ cabin, seats }) => (
              <ManagedFloatingInputBlock
                key={cabin}
                field={`passengersByCabin.${cabin}`}
                label={toHuman.cabinLayout.cabinClass(cabin)}
                required={false}
                description={<p className="text-xs text-gray-500 dark:text-gray-400">{`${seats} seats`}</p>}
                {...countInput}
              />
            ))}
          </FormGrid>

          {splitError === null ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Leave these empty to let the cabins be filled in proportion to their size.
            </p>
          ) : (
            <p className="flex items-start gap-1.5 text-xs font-semibold text-red-600 dark:text-red-500">
              <HiExclamationTriangle className="mt-0.5 size-3.5 shrink-0" />
              <span>{splitError}</span>
            </p>
          )}
        </section>
      )}

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
