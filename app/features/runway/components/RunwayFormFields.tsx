import React from "react";
import { lightingTypeOptions, surfaceTypeOptions } from "~/features/runway";
import { RunwayLocationPicker } from "~/features/runway/components/RunwayLocationPicker";
import type { Coordinates } from "~/shared/models/coordinates";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/shared/ui/Form/Managed/ManagedSelectBlock";

type Props = {
  airportLocation: Coordinates;
};

export function RunwayFormFields({ airportLocation }: Props) {
  return (
    <div className="flex flex-col">
      <ManagedInputBlock field="designator" label="Designator" />

      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock field="length" label="Length (m)" type="number" />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock field="width" label="Width (m)" type="number" />
        </div>
      </div>

      <ManagedInputBlock field="displace" label="Displaced threshold (m)" type="number" required={false} />

      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock field="magneticHeading" label="Magnetic heading (°)" type="number" />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock field="trueHeading" label="True heading (°)" type="number" required={false} />
        </div>
      </div>

      <ManagedInputBlock field="elevation" label="Elevation (m)" type="number" required={false} />

      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock field="latitude" label="Latitude" type="number" />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock field="longitude" label="Longitude" type="number" />
        </div>
      </div>

      <RunwayLocationPicker airportLocation={airportLocation} />

      <div className="flex gap-4">
        <ManagedSelectBlock className="basis-1/2" field="surfaceType" label="Surface" options={surfaceTypeOptions} />
        <ManagedSelectBlock className="basis-1/2" field="lightingType" label="Lighting" options={lightingTypeOptions} />
      </div>
    </div>
  );
}
