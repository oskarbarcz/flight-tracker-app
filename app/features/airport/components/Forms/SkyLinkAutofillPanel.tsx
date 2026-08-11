import { Button, Label, TextInput } from "flowbite-react";
import { useFormikContext } from "formik";
import React, { useState } from "react";
import type { CreateAirportFormData } from "~/features/airport";
import { skyLinkToFormData } from "~/features/skylink/transformer";
import { useApi } from "~/shared/api/useApi";
import { FormSectionLabel } from "~/shared/ui/Form/FormSectionLabel";
import { Container } from "~/shared/ui/Layout/Container";

export function SkyLinkAutofillPanel() {
  const { skyLinkService } = useApi();
  const { setValues } = useFormikContext<CreateAirportFormData>();
  const [iataCodeInput, setIataCodeInput] = useState<string>("");

  async function handleFill() {
    const iataCode = iataCodeInput.trim().toUpperCase();
    if (iataCode.length !== 3) {
      alert("Please enter a valid IATA code.");
      return;
    }

    const response = await skyLinkService.fetchAirportByIataCode(iataCode);
    setValues(skyLinkToFormData(response));
  }

  return (
    <Container>
      <FormSectionLabel>Fill from SkyLink</FormSectionLabel>
      <div className="mt-4 mb-2 block">
        <Label htmlFor="skylinkIataCode">IATA code</Label>
      </div>
      <div className="flex gap-2">
        <TextInput
          id="skylinkIataCode"
          name="skylinkIataCode"
          className="grow"
          value={iataCodeInput}
          onChange={(e) => setIataCodeInput(e.target.value)}
        />
        <Button className="min-w-fit cursor-pointer" color="indigo" onClick={handleFill} outline>
          <span className="pe-1">Fill with</span>
          <span className="font-mono font-bold">SkyLink</span>
        </Button>
      </div>
      <div className="text-center pt-4 italic text-sm text-gray-500">or fill manually below</div>
    </Container>
  );
}
