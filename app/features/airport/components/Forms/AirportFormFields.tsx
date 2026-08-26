import React from "react";
import { AirportCountryField } from "~/features/airport/components/Forms/AirportCountryField";
import { AirportTimezoneField } from "~/features/airport/components/Forms/AirportTimezoneField";
import { continentOptions } from "~/features/operator";
import { FormFieldGroup } from "~/shared/ui/Form/FormFieldGroup";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";
import { ManagedFloatingSelectBlock } from "~/shared/ui/Form/Managed/ManagedFloatingSelectBlock";
import { AirportShapePickerSection } from "~/shared/ui/Form/MapPicker/AirportShapePickerSection";

type Props = {
  autofill?: React.ReactNode;
};

export function AirportFormFields({ autofill }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-9">
      <div className="flex flex-col gap-6 lg:col-span-4">
        {autofill}

        <FormFieldGroup label="Identity">
          <div className="grid grid-cols-12 gap-4">
            <ManagedFloatingInputBlock className="col-span-3" field="iataCode" label="IATA code" />
            <ManagedFloatingInputBlock className="col-span-3" field="icaoCode" label="ICAO code" />
            <ManagedFloatingInputBlock className="col-span-6" field="city" label="City" />

            <ManagedFloatingInputBlock className="col-span-12" field="name" label="Airport name" />
          </div>
        </FormFieldGroup>

        <FormFieldGroup label="Location">
          <div className="grid grid-cols-12 gap-4">
            <AirportCountryField className="col-span-6" />
            <AirportTimezoneField className="col-span-6" />

            <ManagedFloatingSelectBlock
              className="col-span-4"
              field="continent"
              label="Continent"
              options={continentOptions}
            />
            <ManagedFloatingInputBlock className="col-span-4" field="latitude" label="Latitude" type="number" />
            <ManagedFloatingInputBlock className="col-span-4" field="longitude" label="Longitude" type="number" />
          </div>
        </FormFieldGroup>
      </div>

      <AirportShapePickerSection className="lg:col-span-5" />
    </div>
  );
}
