import { useFormikContext } from "formik";
import React from "react";
import { type CreateGateFormData, gateCategoryOptions } from "~/features/gate";
import type { ParkingPosition } from "~/features/parking-position";
import type { Terminal } from "~/features/terminal";
import type { Coordinates } from "~/shared/models/coordinates";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/shared/ui/Form/Managed/ManagedSelectBlock";
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
    <div className="flex flex-col">
      <h3 className="mb-3 font-bold text-gray-900 dark:text-white">Identification</h3>
      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedSelectBlock field="terminalId" label="Terminal" options={terminalOptions} />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock field="name" label="Gate name" />
        </div>
      </div>
      <ManagedSelectBlock field="category" label="Category" options={gateCategoryOptions} />
      <ManagedSelectBlock
        field="parkingPositionId"
        label="Served parking position"
        required={false}
        options={parkingPositionOptions}
      />

      <h3 className="mt-2 mb-3 font-bold text-gray-900 dark:text-white">Location</h3>
      <PointCoordinatesPicker
        field="coordinates"
        airportLocation={airportLocation}
        label="Click on the map to pick the gate location (optional)"
        pinLabel={values.name}
      />
    </div>
  );
}
