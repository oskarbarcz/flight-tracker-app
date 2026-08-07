import React from "react";
import { continentOptions } from "~/features/operator";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/shared/ui/Form/Managed/ManagedSelectBlock";
import { AirportShapePickerSection } from "~/shared/ui/Form/MapPicker/AirportShapePickerSection";

export function AirportFormFields() {
  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock field="iataCode" label="IATA code" />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock field="icaoCode" label="ICAO code" />
        </div>
      </div>

      <ManagedInputBlock field="name" label="Airport name" />

      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock field="city" label="City" />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock field="country" label="Country" />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock field="timezone" label="Timezone" />
        </div>
        <ManagedSelectBlock className="basis-1/2" field="continent" label="Continent" options={continentOptions} />
      </div>

      <div className="flex gap-4">
        <div className="basis-1/2">
          <ManagedInputBlock field="latitude" label="Latitude" type="number" />
        </div>
        <div className="basis-1/2">
          <ManagedInputBlock field="longitude" label="Longitude" type="number" />
        </div>
      </div>

      <AirportShapePickerSection />
    </div>
  );
}
