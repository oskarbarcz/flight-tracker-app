"use client";

import React, { useState } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button, Label, TextInput } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import Container from "~/components/Container";
import AirportLocationFormSection from "~/components/Forms/Airport/AirportLocationFormSection";
import FormSubmit from "~/components/Form/FormSubmit";
import AirportGeneralFormSection, {
  AirportGeneralFormData,
} from "~/components/Forms/Airport/AirportGeneralFormSection";
import { useNavigate } from "react-router";
import { useApi } from "~/state/contexts/api.context";
import {
  CreateAirportFormData,
  formDataToApiFormat,
  initCreateAirportData,
  skyLinkToFormData,
} from "~/models";

export default function CreateAirportRoute() {
  const { skyLinkService, airportService } = useApi();
  const navigate = useNavigate();
  const [iataCodeInput, setIataCodeInput] = useState<string>("");
  const [formData, setFormData] = useState<CreateAirportFormData>(
    initCreateAirportData(),
  );
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  usePageTitle("Create new airport");

  async function handleCreateWithSkyLink() {
    const iataCode = iataCodeInput.trim().toUpperCase();

    if (!iataCode || iataCode.length !== 3) {
      alert("Please enter a valid IATA code.");
      return;
    }

    skyLinkService.getAirportByIataCode(iataCodeInput).then((response) => {
      setFormData((form) => ({
        ...form,
        ...skyLinkToFormData(response),
      }));
    });
  }

  function onGeneralSectionSubmit(general: AirportGeneralFormData) {
    setFormData((prev) => ({ ...prev, general }));
    setFormErrorMessage(null);
  }

  const onLocationSectionSubmit = (
    location: CreateAirportFormData["location"],
  ) => {
    setFormData((prev) => ({ ...prev, location }));
    setFormErrorMessage(null);
  };

  const handleSubmit = () => {
    const newAirport = formDataToApiFormat(formData);
    airportService
      .createNew(newAirport)
      .then(() => {
        navigate("/airports");
      })
      .catch((err: { message: never }) => {
        setFormErrorMessage(err.message);
      });
  };

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="mx-auto max-w-lg pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Create new airport"
          backText="Back to airports"
          backUrl="/airports"
        />

        <div className="flex flex-col gap-4">
          <Container>
            <h2 className="sr-only">Enter IATA code first</h2>
            <div className="mb-2 block">
              <Label htmlFor="iataCode">IATA code</Label>
            </div>
            <div className="flex gap-2">
              <TextInput
                id="iataCode"
                name="iataCode"
                className="grow"
                value={iataCodeInput}
                onChange={(e) => setIataCodeInput(e.target.value)}
              />
              <Button
                className="min-w-fit cursor-pointer"
                onClick={handleCreateWithSkyLink}
                outline
              >
                <span className="pe-1">Fill with</span>
                <span className="font-mono font-bold">SkyLink</span>
              </Button>
            </div>
            <div className="text-center pt-4 italic text-sm text-gray-500">
              or fill manually below
            </div>
          </Container>

          <AirportGeneralFormSection
            data={formData.general}
            onSectionSubmit={onGeneralSectionSubmit}
          />

          <AirportLocationFormSection
            data={formData.location}
            onSectionSubmit={onLocationSectionSubmit}
          />

          <FormSubmit
            message={formErrorMessage}
            onSubmit={handleSubmit}
            button="Create airport"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
