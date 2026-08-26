import { useFormikContext } from "formik";
import React, { useEffect } from "react";
import { HiExclamationTriangle } from "react-icons/hi2";
import { CabinCapacityHint } from "~/features/flight/components/Forms/CabinCapacityHint";
import { DerivedField } from "~/features/flight/components/Forms/DerivedField";
import { countInput, tonsInput } from "~/features/flight/components/Forms/loadsheetFields";
import { type FlatLoadsheetFormData, flatLoadsheetToLoadsheet } from "~/features/flight/form-types";
import type { CabinCapacity } from "~/features/flight/hooks/useCabinCapacity";
import { occupantsLabel } from "~/features/flight/lib/occupants";
import type { FlightServiceType } from "~/features/flight/model";
import { toHuman } from "~/i18n/translate";
import { FormGrid } from "~/shared/ui/Form/FormGrid";
import { FormSectionLabel } from "~/shared/ui/Form/FormSectionLabel";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";

type Props = {
  serviceType: FlightServiceType;
  capacity: CabinCapacity | null;
};

export function LoadsheetLoadStep({ serviceType, capacity }: Props) {
  const { values, errors, setFieldValue } = useFormikContext<FlatLoadsheetFormData>();
  const loadsheet = flatLoadsheetToLoadsheet(values);
  const splitError = typeof errors.passengersByCabin === "string" ? errors.passengersByCabin : null;
  const grossTakeoffWeight = loadsheet.zeroFuelWeight + loadsheet.blockFuel;
  const cabins = capacity?.cabins ?? [];
  const seatedTotal = cabins.reduce((running, { cabin }) => running + Number(values.passengersByCabin[cabin] || 0), 0);

  useEffect(() => {
    if (cabins.length > 0 && Number(values.passengers) !== seatedTotal) {
      setFieldValue("passengers", seatedTotal);
    }
  }, [cabins.length, seatedTotal, values.passengers, setFieldValue]);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <FormSectionLabel>Flight crew</FormSectionLabel>

        <FormGrid columns={3}>
          <ManagedFloatingInputBlock field="pilots" label="Pilots" {...countInput} />
          <ManagedFloatingInputBlock field="reliefPilots" label="Relief pilots" {...countInput} />
          <ManagedFloatingInputBlock field="cabinCrew" label="Cabin crew" {...countInput} />
        </FormGrid>
      </section>

      <section className="flex flex-col gap-4">
        <FormSectionLabel>Passengers</FormSectionLabel>

        {cabins.length > 0 && (
          <FormGrid columns={2}>
            {cabins.map(({ cabin, seats }) => (
              <ManagedFloatingInputBlock
                key={cabin}
                field={`passengersByCabin.${cabin}`}
                label={toHuman.cabinLayout.cabinClass(cabin)}
                required={false}
                footnote={`${seats} seats`}
                {...countInput}
              />
            ))}
          </FormGrid>
        )}

        {cabins.length > 0 && capacity !== null ? (
          <DerivedField
            label="Total passengers"
            value={seatedTotal}
            unit=""
            decimals={0}
            description={<CabinCapacityHint capacity={capacity} passengers={seatedTotal} />}
          />
        ) : (
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
        )}

        {splitError !== null && (
          <p className="flex items-start gap-1.5 text-xs font-semibold text-red-600 dark:text-red-500">
            <HiExclamationTriangle className="mt-0.5 size-3.5 shrink-0" />
            <span>{splitError}</span>
          </p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <FormSectionLabel>Weight</FormSectionLabel>

        <FormGrid columns={3}>
          <ManagedFloatingInputBlock field="cargo" label="Cargo" {...tonsInput} />
          <ManagedFloatingInputBlock field="payload" label="Payload" {...tonsInput} />
          <ManagedFloatingInputBlock field="zeroFuelWeight" label="Zero-fuel weight" {...tonsInput} />
        </FormGrid>

        <DerivedField label="Gross takeoff weight" value={grossTakeoffWeight} />
      </section>
    </div>
  );
}
