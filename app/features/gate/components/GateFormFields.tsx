import { useFormikContext } from "formik";
import React from "react";
import { type CreateGateFormData, gateCategoryOptions } from "~/features/gate";
import type { ParkingPosition } from "~/features/parking-position";
import type { Terminal } from "~/features/terminal";
import type { Coordinates } from "~/shared/models/coordinates";
import { FormFieldGroup } from "~/shared/ui/Form/FormFieldGroup";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";
import { ManagedFloatingSelectBlock } from "~/shared/ui/Form/Managed/ManagedFloatingSelectBlock";
import { PointCoordinatesPicker } from "~/shared/ui/Form/MapPicker/PointCoordinatesPicker";

type Props = {
  airportLocation: Coordinates;
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
};

export function GateFormFields({ airportLocation, terminals, parkingPositions }: Props) {
  const { values } = useFormikContext<CreateGateFormData>();
  const terminalOptions = terminals.map((terminal) => ({
    value: terminal.id,
    label: `${terminal.shortName} · ${terminal.fullName}`,
  }));
  const parkingPositionOptions = [
    { value: "", label: "— No parking position —" },
    ...parkingPositions.map((parkingPosition) => ({ value: parkingPosition.id, label: parkingPosition.name })),
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-8">
      <div className="flex flex-col gap-6 lg:col-span-3">
        <FormFieldGroup label="Identity">
          <div className="grid grid-cols-12 gap-4">
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-7"
              field="terminalId"
              label="Terminal"
              options={terminalOptions}
            />
            <ManagedFloatingInputBlock className="col-span-12 sm:col-span-5" field="name" label="Gate name" />

            <ManagedFloatingSelectBlock
              className="col-span-12"
              field="category"
              label="Category"
              options={gateCategoryOptions}
            />
          </div>
        </FormFieldGroup>

        <FormFieldGroup label="Stand">
          <ManagedFloatingSelectBlock
            field="parkingPositionId"
            label="Served parking position"
            required={false}
            options={parkingPositionOptions}
          />
        </FormFieldGroup>
      </div>

      <PointCoordinatesPicker
        className="lg:col-span-5"
        field="coordinates"
        airportLocation={airportLocation}
        label="Location"
        pinLabel={values.name}
      />
    </div>
  );
}
