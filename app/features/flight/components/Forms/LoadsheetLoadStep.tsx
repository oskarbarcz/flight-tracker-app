import { useFormikContext } from "formik";
import React, { useEffect } from "react";
import { HiExclamationTriangle } from "react-icons/hi2";
import { CabinCapacityHint } from "~/features/flight/components/Forms/CabinCapacityHint";
import { DerivedField } from "~/features/flight/components/Forms/DerivedField";
import { LoadChangesSummary } from "~/features/flight/components/Forms/LoadChangesSummary";
import { countInput, tonsInput } from "~/features/flight/components/Forms/loadsheetFields";
import { type FlatLoadsheetFormData, flatLoadsheetToLoadsheet } from "~/features/flight/form-types";
import type { CabinCapacity } from "~/features/flight/hooks/useCabinCapacity";
import { occupantsLabel } from "~/features/flight/lib/occupants";
import { FlightServiceType } from "~/features/flight/model";
import { toHuman } from "~/i18n/translate";
import { FormGrid } from "~/shared/ui/Form/FormGrid";
import { FormSectionLabel } from "~/shared/ui/Form/FormSectionLabel";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";

type Props = {
  serviceType: FlightServiceType;
  capacity: CabinCapacity | null;
  reference?: FlatLoadsheetFormData;
};

const TON_FORMAT: Intl.NumberFormatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false };

function Tons({ value }: { value: number }) {
  return (
    <>
      <span className="font-mono tabular-nums text-gray-700 dark:text-gray-200">
        {value.toLocaleString(undefined, TON_FORMAT)}
      </span>{" "}
      t
    </>
  );
}

type LoadFactorProps = {
  capacity: CabinCapacity;
  passengers: number;
  serviceType: FlightServiceType;
};

function LoadFactor({ capacity, passengers, serviceType }: LoadFactorProps) {
  if (serviceType === FlightServiceType.Cargo) {
    return <CabinCapacityHint capacity={capacity} passengers={passengers} />;
  }

  const percent = capacity.totalSeats === 0 ? 0 : Math.round((passengers / capacity.totalSeats) * 100);

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        of <span className="font-mono tabular-nums">{capacity.totalSeats}</span> seats ·{" "}
        <span className="font-mono tabular-nums text-gray-700 dark:text-gray-200">{percent}%</span> load factor
      </p>
      <CabinCapacityHint capacity={capacity} passengers={passengers} />
    </div>
  );
}

export function LoadsheetLoadStep({ serviceType, capacity, reference }: Props) {
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
      {reference !== undefined && <LoadChangesSummary reference={reference} values={values} capacity={capacity} />}

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
          <div className="grid grid-cols-2 gap-4">
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
          </div>
        )}

        {cabins.length > 0 && capacity !== null ? (
          <DerivedField
            label="Total passengers"
            value={seatedTotal}
            unit=""
            decimals={0}
            description={<LoadFactor capacity={capacity} passengers={seatedTotal} serviceType={serviceType} />}
          />
        ) : (
          <ManagedFloatingInputBlock
            field="passengers"
            label={occupantsLabel(serviceType)}
            description={
              capacity === null ? undefined : (
                <LoadFactor capacity={capacity} passengers={Number(values.passengers)} serviceType={serviceType} />
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

        <DerivedField
          label="Gross takeoff weight"
          value={grossTakeoffWeight}
          description={
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Zero-fuel weight <Tons value={loadsheet.zeroFuelWeight} /> + block fuel{" "}
              <Tons value={loadsheet.blockFuel} />
            </p>
          }
        />
      </section>
    </div>
  );
}
