"use client";

import React, { useState } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button, Label, TextInput } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import { useLoaderData, useNavigate } from "react-router";
import { AirportService } from "~/state/api/airport.service";
import { CreateAirportFormData } from "~/models";
import { Route } from "../../../../.react-router/types/app/routes/operations/airports/+types/EditAirportRoute";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import Container from "~/components/Layout/Container";
import AirportGeneralFormSection from "~/components/Forms/Airport/AirportGeneralFormSection";
import AirportLocationFormSection from "~/components/Forms/Airport/AirportLocationFormSection";
import FormSubmit from "~/components/Form/FormSubmit";
import { useApi } from "~/state/contexts/api.context";
import { skyLinkToFormData } from "~/state/api/transformer/skylink.transformer";
import {
  airportToFormData,
  formDataToApiFormat,
} from "~/state/api/transformer/airport.transformer";
import { GetAirportResponse } from "~/state/api/model/airport.dto";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<GetAirportResponse> {
  return new AirportService().getById(params.id);
}

export default function EditAirportRoute() {
  usePageTitle("Edit airport");
  const airport = useLoaderData<GetAirportResponse>();

  const { skyLinkService, airportService } = useApi();
  const navigate = useNavigate();
  const [iataCodeInput, setIataCodeInput] = useState<string>("");
  const [formData, setFormData] = useState<CreateAirportFormData>(
    airportToFormData(airport),
  );

  const [formMessage, setFormMessage] = useState<string | undefined>(
    "Save all sections first.",
  );
  const [formError, setFormError] = useState<string | undefined>();

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

  const onGeneralSectionSubmit = (
    general: CreateAirportFormData["general"],
  ) => {
    setFormData((prev) => ({
      ...prev,
      general,
      isGeneralSubmitted: true,
    }));
    setFormError(undefined);

    if (formData.isLocationSubmitted) {
      setFormMessage(undefined);
    }
  };

  const onLocationSectionSubmit = (
    location: CreateAirportFormData["location"],
  ) => {
    setFormData((prev) => ({
      ...prev,
      location,
      isLocationSubmitted: true,
    }));
    setFormError(undefined);

    if (formData.isGeneralSubmitted) {
      setFormMessage(undefined);
    }
  };

  const handleSubmit = () => {
    const updatedAirport = formDataToApiFormat(formData);
    airportService
      .update(airport.id, updatedAirport)
      .then(() => {
        navigate(`/airports?continent=${updatedAirport.continent}`, {
          viewTransition: true,
        });
      })
      .catch((err: { message: never }) => {
        setFormError(err.message);
      });
  };

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Edit airport"
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
            onSubmit={onGeneralSectionSubmit}
          />

          <AirportLocationFormSection
            data={formData.location}
            onSubmit={onLocationSectionSubmit}
          />

          <FormSubmit
            message={formMessage}
            error={formError}
            onSubmit={handleSubmit}
            button="Save changes"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
