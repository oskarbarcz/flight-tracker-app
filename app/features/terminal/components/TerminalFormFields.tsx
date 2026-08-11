import React from "react";
import type { Coordinates } from "~/shared/models/coordinates";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { ManagedTextareaBlock } from "~/shared/ui/Form/Managed/ManagedTextareaBlock";
import { PolygonShapePicker } from "~/shared/ui/Form/MapPicker/PolygonShapePicker";

type Props = {
  airportLocation: Coordinates;
};

export function TerminalFormFields({ airportLocation }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        <div className="basis-1/3">
          <ManagedInputBlock field="shortName" label="Short name" />
        </div>
        <div className="basis-2/3">
          <ManagedInputBlock field="fullName" label="Full name" />
        </div>
      </div>

      <ManagedInputBlock field="averageTaxiTime" label="Average taxi time (min)" type="number" />

      <ManagedInputBlock field="operatorCodes" label="Operator ICAO codes (comma separated)" required={false} />

      <ManagedTextareaBlock
        field="text"
        label="Briefing notes"
        rows={4}
        required={false}
        placeholder="Free-text notes shown to crews."
      />

      <PolygonShapePicker
        className="mb-4"
        field="shape"
        airportLocation={airportLocation}
        label="Footprint"
        tone="terminal"
      />
    </div>
  );
}
