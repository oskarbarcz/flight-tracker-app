import React from "react";
import { HiOutlineChartBar, HiOutlineIdentification } from "react-icons/hi";
import { continentOptions, operatorTypeOptions } from "~/features/operator";
import { FormRow } from "~/shared/ui/Form/FormRow";
import { FormDensityProvider } from "~/shared/ui/Form/formDensity";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";
import { ManagedFloatingSelectBlock } from "~/shared/ui/Form/Managed/ManagedFloatingSelectBlock";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

export function OperatorFormFields() {
  return (
    <FormDensityProvider density="compact">
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-4">
          <ContainerTitle icon={HiOutlineIdentification} title="Identity" />

          <FormRow>
            <ManagedFloatingInputBlock className="basis-1/4" field="icaoCode" label="ICAO code" />
            <ManagedFloatingInputBlock className="basis-1/4" field="iataCode" label="IATA code" />
            <ManagedFloatingInputBlock className="basis-1/2" field="shortName" label="Short name" />
          </FormRow>

          <FormRow>
            <ManagedFloatingInputBlock className="basis-1/2" field="callsign" label="Callsign" />
            <ManagedFloatingInputBlock className="basis-1/2" field="fullName" label="Full name" />
          </FormRow>
        </section>

        <section className="flex flex-col gap-4">
          <ContainerTitle icon={HiOutlineChartBar} title="Stats" />

          <FormRow>
            <ManagedFloatingSelectBlock
              className="basis-1/2"
              field="type"
              label="Operator type"
              options={operatorTypeOptions}
            />
            <ManagedFloatingSelectBlock
              className="basis-1/2"
              field="continent"
              label="Continent"
              options={continentOptions}
            />
          </FormRow>

          <FormRow>
            <ManagedFloatingInputBlock
              className="basis-1/3"
              field="avgFleetAge"
              label="Average fleet age"
              type="number"
            />
            <ManagedFloatingInputBlock
              className="basis-2/3"
              field="hubs"
              label="Hubs (comma-separated IATA codes)"
              required={false}
            />
          </FormRow>

          <ManagedFloatingInputBlock field="logoUrl" label="Logo URL" required={false} />
          <ManagedFloatingInputBlock field="backgroundUrl" label="Background URL" required={false} />
        </section>
      </div>
    </FormDensityProvider>
  );
}
