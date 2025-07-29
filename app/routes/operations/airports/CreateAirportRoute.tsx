"use client";

import React, { useState } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button, Label, TextInput } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import Container from "~/components/Container";
import AirportLocationFormSection from "~/components/Forms/Airport/AirportLocationFormSection";
import FormSubmit from "~/components/Form/Section/FormSubmit";
import AirportGeneralFormSection from "~/components/Forms/Airport/AirportGeneralFormSection";
import { Continent, CreateAirportDto, SkyLinkAirportResponse } from "~/models";
import { useNavigate } from "react-router";
import { useApi } from "~/state/contexts/api.context";

type CreateAirportFormData = {
  general: {
    icaoCode: string;
    iataCode: string;
    name: string;
  };
  location: {
    city: string;
    country: string;
    timezone: string;
    continent: string;
    latitude: number;
    longitude: number;
  };
};

const initialFormData = {
  general: {
    icaoCode: "",
    iataCode: "",
    name: "",
  },
  location: {
    city: "",
    country: "",
    timezone: "",
    continent: Continent.Europe,
    latitude: 0,
    longitude: 0,
  },
};

const skyLinkToFormData = (
  input: SkyLinkAirportResponse,
): CreateAirportFormData => ({
  general: {
    icaoCode: input.icao,
    iataCode: input.iata,
    name: input.name,
  },
  location: {
    city: input.city,
    country: input.country,
    timezone: input.timezone,
    continent: Continent.Europe,
    latitude: parseFloat(input.latitude),
    longitude: parseFloat(input.longitude),
  },
});

const formDataToApiFormat = (
  input: CreateAirportFormData,
): CreateAirportDto => ({
  ...input.general,
  city: input.location.city,
  country: input.location.country,
  continent: input.location.continent as Continent,
  timezone: input.location.timezone,
  location: {
    latitude: input.location.latitude,
    longitude: input.location.longitude,
  },
});

export default function CreateAirportRoute() {
  const { skyLinkService, airportService } = useApi();
  const navigate = useNavigate();
  const [iataCodeInput, setIataCodeInput] = useState<string>("");
  const [formData, setFormData] =
    useState<CreateAirportFormData>(initialFormData);
  const [isGeneralSubmitted, setIsGeneralSubmitted] = useState<boolean>(false);
  const [isLocationSubmitted, setIsLocationSubmitted] =
    useState<boolean>(false);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  usePageTitle("Create new airport");

  const handleCreateWithSkyLink = async () => {
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
      setIsGeneralSubmitted(true);
      setIsLocationSubmitted(true);
    });
  };

  const handleGeneralDataChange = (
    general: CreateAirportFormData["general"],
  ) => {
    setFormData((prev) => ({ ...prev, general }));
    setFormErrorMessage(null);
  };

  const handleLocationDataChange = (
    location: CreateAirportFormData["location"],
  ) => {
    setFormData((prev) => ({ ...prev, location }));
    setFormErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isGeneralSubmitted || !isLocationSubmitted) {
      setFormErrorMessage("At least one of sections above is not saved.");
      return;
    }

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

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            setData={handleGeneralDataChange}
            setIsSubmittable={setIsGeneralSubmitted}
          />

          <AirportLocationFormSection
            data={formData.location}
            setData={handleLocationDataChange}
            setIsSubmittable={setIsLocationSubmitted}
          />

          <FormSubmit message={formErrorMessage} button="Create airport" />
        </form>
      </div>
    </ProtectedRoute>
  );
}
