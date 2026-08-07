import { useFormikContext } from "formik";
import React from "react";
import {
  bridgeOptions,
  type CreateParkingPositionFormData,
  DeicingCapability,
  deicingOptions,
  fuelingOptionsList,
  gateLocationOptions,
  groundUnitOptions,
  NoiseSensitivity,
  noiseSensitivityOptions,
  parkingAssistanceOptions,
  parkingPositionTypeOptions,
  parkingSpotTypeOptions,
  stairsOptions,
} from "~/features/parking-position";
import type { Terminal } from "~/features/terminal";
import type { Coordinates } from "~/shared/models/coordinates";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/shared/ui/Form/Managed/ManagedSelectBlock";
import { ManagedTextareaBlock } from "~/shared/ui/Form/Managed/ManagedTextareaBlock";
import { PointCoordinatesPicker } from "~/shared/ui/Form/MapPicker/PointCoordinatesPicker";

type Props = {
  airportLocation: Coordinates;
  terminals: Terminal[];
};

export function ParkingPositionFormFields({ airportLocation, terminals }: Props) {
  const { values } = useFormikContext<CreateParkingPositionFormData>();
  const noiseActive = values.noiseSensitivity === NoiseSensitivity.Yes;
  const deicingActive = values.deicing !== DeicingCapability.No;

  const terminalOptions = terminals.map((terminal) => ({
    value: terminal.id,
    label: `${terminal.shortName} · ${terminal.fullName}`,
  }));

  return (
    <div className="flex flex-col">
      <h3 className="mb-3 font-bold text-gray-900 dark:text-white">Identification</h3>
      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedSelectBlock field="terminalId" label="Terminal" options={terminalOptions} />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock field="name" label="Parking position name" />
        </div>
      </div>
      <ManagedSelectBlock field="location" label="Parking location" options={gateLocationOptions} />

      <h3 className="mt-2 mb-3 font-bold text-gray-900 dark:text-white">Boarding</h3>
      <div className="flex gap-4">
        <ManagedSelectBlock className="basis-1/2" field="bridge" label="Jet bridge" options={bridgeOptions} />
        <ManagedSelectBlock className="basis-1/2" field="stairs" label="Stairs boarding" options={stairsOptions} />
      </div>

      <h3 className="mt-2 mb-3 font-bold text-gray-900 dark:text-white">Parking</h3>
      <div className="flex gap-4">
        <ManagedSelectBlock className="basis-1/2" field="type" label="Position" options={parkingPositionTypeOptions} />
        <ManagedSelectBlock className="basis-1/2" field="spotType" label="Spot type" options={parkingSpotTypeOptions} />
      </div>
      <ManagedSelectBlock field="assistance" label="Parking assistance" options={parkingAssistanceOptions} />

      <h3 className="mt-2 mb-3 font-bold text-gray-900 dark:text-white">Services</h3>
      <div className="flex gap-4">
        <ManagedSelectBlock className="basis-1/2" field="gpu" label="GPU" options={groundUnitOptions} />
        <ManagedSelectBlock className="basis-1/2" field="pca" label="PCA" options={groundUnitOptions} />
      </div>
      <ManagedSelectBlock field="fuelingOptions" label="Fueling" options={fuelingOptionsList} />

      <h3 className="mt-2 mb-3 font-bold text-gray-900 dark:text-white">Deicing</h3>
      <ManagedSelectBlock field="deicing" label="Deicing capability" options={deicingOptions} />
      {deicingActive ? (
        <ManagedTextareaBlock
          field="deicingDescription"
          label="Deicing notes"
          rows={3}
          required={false}
          placeholder="Free-text notes about deicing logistics."
        />
      ) : null}

      <h3 className="mt-2 mb-3 font-bold text-gray-900 dark:text-white">Noise sensitivity</h3>
      <ManagedSelectBlock field="noiseSensitivity" label="Noise-sensitive area?" options={noiseSensitivityOptions} />
      {noiseActive ? (
        <>
          <div className="flex gap-4">
            <ManagedInputBlock field="noiseSensitivityStartTime" label="Curfew start (UTC HH:mm)" required={false} />
            <ManagedInputBlock field="noiseSensitivityEndTime" label="Curfew end (UTC HH:mm)" required={false} />
          </div>
          <ManagedTextareaBlock
            field="noiseSensitivityText"
            label="Noise restrictions notes"
            rows={3}
            required={false}
            placeholder="Free-text notes about noise restrictions."
          />
        </>
      ) : null}

      <h3 className="mt-2 mb-3 font-bold text-gray-900 dark:text-white">Parking position</h3>
      <PointCoordinatesPicker
        field="coordinates"
        airportLocation={airportLocation}
        label="Click on the map to pick the parking position"
        pinLabel={values.name}
      />
    </div>
  );
}
