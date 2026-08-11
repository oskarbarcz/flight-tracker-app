import React from "react";
import type { Coordinates } from "~/shared/models/coordinates";
import { FormFieldGroup } from "~/shared/ui/Form/FormFieldGroup";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";
import { ManagedTextareaBlock } from "~/shared/ui/Form/Managed/ManagedTextareaBlock";
import { PolygonShapePicker } from "~/shared/ui/Form/MapPicker/PolygonShapePicker";

type Props = {
  airportLocation: Coordinates;
};

export function TerminalFormFields({ airportLocation }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-8">
      <div className="flex flex-col gap-6 lg:col-span-3">
        <FormFieldGroup label="Identity">
          <div className="grid grid-cols-12 gap-4">
            <ManagedFloatingInputBlock className="col-span-4" field="shortName" label="Short name" />
            <ManagedFloatingInputBlock className="col-span-8" field="fullName" label="Full name" />
          </div>
        </FormFieldGroup>

        <FormFieldGroup label="Operations">
          <div className="grid grid-cols-12 gap-4">
            <ManagedFloatingInputBlock
              className="col-span-12"
              field="averageTaxiTime"
              label="Average taxi time"
              unit="min"
              type="number"
            />
            <ManagedFloatingInputBlock
              className="col-span-12"
              field="operatorCodes"
              label="Operator ICAO codes"
              required={false}
            />
            <ManagedTextareaBlock
              className="col-span-12 mb-0"
              field="text"
              label="Briefing notes"
              rows={4}
              required={false}
              placeholder="Free-text notes shown to crews."
            />
          </div>
        </FormFieldGroup>
      </div>

      <PolygonShapePicker
        className="lg:col-span-5"
        field="shape"
        airportLocation={airportLocation}
        label="Footprint"
        tone="terminal"
      />
    </div>
  );
}
