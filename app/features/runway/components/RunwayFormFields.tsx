import React from "react";
import { lightingTypeOptions, surfaceTypeOptions } from "~/features/runway";
import { RunwayLocationPicker } from "~/features/runway/components/RunwayLocationPicker";
import type { Coordinates } from "~/shared/models/coordinates";
import { FormFieldGroup } from "~/shared/ui/Form/FormFieldGroup";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";
import { ManagedFloatingSelectBlock } from "~/shared/ui/Form/Managed/ManagedFloatingSelectBlock";

type Props = {
  airportLocation: Coordinates;
};

export function RunwayFormFields({ airportLocation }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-8">
      <div className="flex flex-col gap-6 lg:col-span-3">
        <FormFieldGroup label="Identity">
          <ManagedFloatingInputBlock field="designator" label="Designator" />
        </FormFieldGroup>

        <FormFieldGroup label="Dimensions">
          <div className="grid grid-cols-12 gap-4">
            <ManagedFloatingInputBlock
              className="col-span-12 sm:col-span-4"
              field="length"
              label="Length"
              unit="m"
              type="number"
            />
            <ManagedFloatingInputBlock
              className="col-span-12 sm:col-span-4"
              field="width"
              label="Width"
              unit="m"
              type="number"
            />
            <ManagedFloatingInputBlock
              className="col-span-12 sm:col-span-4"
              field="elevation"
              label="Elevation"
              unit="m"
              type="number"
              required={false}
            />

            <ManagedFloatingInputBlock
              className="col-span-12 sm:col-span-6"
              field="magneticHeading"
              label="Magnetic heading"
              unit="°"
              type="number"
            />
            <ManagedFloatingInputBlock
              className="col-span-12 sm:col-span-6"
              field="trueHeading"
              label="True heading"
              unit="°"
              type="number"
              required={false}
            />

            <ManagedFloatingInputBlock
              className="col-span-12"
              field="displace"
              label="Displaced threshold"
              unit="m"
              type="number"
              required={false}
            />
          </div>
        </FormFieldGroup>

        <FormFieldGroup label="Hardware">
          <div className="grid grid-cols-12 gap-4">
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-6"
              field="surfaceType"
              label="Surface"
              options={surfaceTypeOptions}
            />
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-6"
              field="lightingType"
              label="Lighting"
              options={lightingTypeOptions}
            />
          </div>
        </FormFieldGroup>
      </div>

      <RunwayLocationPicker className="lg:col-span-5" airportLocation={airportLocation} />
    </div>
  );
}
