import { Button, FloatingLabel } from "flowbite-react";
import { useFormikContext } from "formik";
import React, { useState } from "react";
import type { CreateAirportFormData } from "~/features/airport";
import { useCountries } from "~/features/country";
import { skyLinkToFormData } from "~/features/skylink/transformer";
import { useApi } from "~/shared/api/useApi";
import { FormFieldGroup } from "~/shared/ui/Form/FormFieldGroup";
import { useFormDensity } from "~/shared/ui/Form/formDensity";

export function SkyLinkAutofillPanel() {
  const { skyLinkService } = useApi();
  const countries = useCountries();
  const { setValues } = useFormikContext<CreateAirportFormData>();
  const [iataCodeInput, setIataCodeInput] = useState<string>("");
  const density = useFormDensity();

  async function handleFill() {
    const iataCode = iataCodeInput.trim().toUpperCase();
    if (iataCode.length !== 3) {
      alert("Please enter a valid IATA code.");
      return;
    }

    const response = await skyLinkService.fetchAirportByIataCode(iataCode);
    setValues(skyLinkToFormData(response, countries));
  }

  return (
    <FormFieldGroup label="Fill from SkyLink">
      <div className="flex items-start gap-2">
        <FloatingLabel
          variant="outlined"
          label="IATA code"
          sizing={density.floatingSizing}
          id="skylinkIataCode"
          name="skylinkIataCode"
          className="whitespace-nowrap dark:bg-gray-800"
          value={iataCodeInput}
          onChange={(event) => setIataCodeInput(event.target.value)}
        />
        <Button className="min-w-fit cursor-pointer" color="indigo" size="sm" onClick={handleFill} outline>
          <span className="pe-1">Fill with</span>
          <span className="font-mono font-bold">SkyLink</span>
        </Button>
      </div>
    </FormFieldGroup>
  );
}
