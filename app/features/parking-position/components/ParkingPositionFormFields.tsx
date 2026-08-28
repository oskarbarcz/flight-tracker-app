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
import { FormFieldGroup } from "~/shared/ui/Form/FormFieldGroup";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";
import { ManagedFloatingSelectBlock } from "~/shared/ui/Form/Managed/ManagedFloatingSelectBlock";
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
    <div className="grid gap-6 lg:grid-cols-9">
      <div className="flex flex-col gap-6 lg:col-span-4">
        <FormFieldGroup label="Identity">
          <div className="grid grid-cols-12 gap-4">
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-5"
              field="terminalId"
              label="Terminal"
              options={terminalOptions}
            />
            <ManagedFloatingInputBlock className="col-span-12 sm:col-span-3" field="name" label="Name" />
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-4"
              field="location"
              label="Parking location"
              options={gateLocationOptions}
            />
          </div>
        </FormFieldGroup>

        <FormFieldGroup label="Boarding">
          <div className="grid grid-cols-12 gap-4">
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-6"
              field="bridge"
              label="Jet bridge"
              options={bridgeOptions}
            />
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-6"
              field="stairs"
              label="Stairs boarding"
              options={stairsOptions}
            />
          </div>
        </FormFieldGroup>

        <FormFieldGroup label="Parking">
          <div className="grid grid-cols-12 gap-4">
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-4"
              field="type"
              label="Position"
              options={parkingPositionTypeOptions}
            />
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-4"
              field="spotType"
              label="Spot type"
              options={parkingSpotTypeOptions}
            />
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-4"
              field="assistance"
              label="Assistance"
              options={parkingAssistanceOptions}
            />
          </div>
        </FormFieldGroup>

        <FormFieldGroup label="Services">
          <div className="grid grid-cols-12 gap-4">
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-6"
              field="gpu"
              label="GPU"
              options={groundUnitOptions}
            />
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-6"
              field="pca"
              label="PCA"
              options={groundUnitOptions}
            />
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-6"
              field="fuelingOptions"
              label="Fueling"
              options={fuelingOptionsList}
            />
            <ManagedFloatingSelectBlock
              className="col-span-12 sm:col-span-6"
              field="deicing"
              label="Deicing"
              options={deicingOptions}
            />

            {deicingActive ? (
              <ManagedTextareaBlock
                className="col-span-12 mb-0"
                field="deicingDescription"
                label="Deicing notes"
                rows={3}
                required={false}
                placeholder="Free-text notes about deicing logistics."
              />
            ) : null}
          </div>
        </FormFieldGroup>

        <FormFieldGroup label="Noise sensitivity">
          <div className="grid grid-cols-12 gap-4">
            <ManagedFloatingSelectBlock
              className={noiseActive ? "col-span-12 sm:col-span-6" : "col-span-12"}
              field="noiseSensitivity"
              label="Noise-sensitive area?"
              options={noiseSensitivityOptions}
            />
            {noiseActive ? (
              <>
                <ManagedFloatingInputBlock
                  className="col-span-12 sm:col-span-3"
                  field="noiseSensitivityStartTime"
                  label="Curfew start"
                  unit="UTC"
                  required={false}
                />
                <ManagedFloatingInputBlock
                  className="col-span-12 sm:col-span-3"
                  field="noiseSensitivityEndTime"
                  label="Curfew end"
                  unit="UTC"
                  required={false}
                />
                <ManagedTextareaBlock
                  className="col-span-12 mb-0"
                  field="noiseSensitivityText"
                  label="Noise restrictions notes"
                  rows={3}
                  required={false}
                  placeholder="Free-text notes about noise restrictions."
                />
              </>
            ) : null}
          </div>
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
