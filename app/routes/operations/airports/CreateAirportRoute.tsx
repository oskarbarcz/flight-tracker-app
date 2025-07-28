"use client";

import React, { useState } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button, Label, TextInput } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import Container from "~/components/Container";
import { useSkyLinkService } from "~/state/hooks/api/useSkyLinkService";
import AirportLocationFormSection from "~/components/Forms/Airport/AirportLocationFormSection";
import FormSubmit from "~/components/Intrinsic/Form/FormSubmit";
import AirportGeneralFormSection from "~/components/Forms/Airport/AirportGeneralFormSection";
import {CreateAirportDto, SkyLinkAirportResponse} from "~/models";
import {useAirportService} from "~/state/hooks/api/useAirportService";
import {useNavigate} from "react-router";

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
    latitude: 0,
    longitude: 0,
  },
};

const skyLinkToFormData = (input: SkyLinkAirportResponse): CreateAirportFormData => ({
  general: {
    icaoCode: input.icao,
    iataCode: input.iata,
    name: input.name,
  },
  location: {
    city: input.city,
    country: input.country,
    timezone: input.timezone,
    latitude: parseFloat(input.latitude),
    longitude: parseFloat(input.longitude),
  },
});

const formDataToApiFormat = (input: CreateAirportFormData): CreateAirportDto => ({
  ...input.general,
  ...input.location,
});

export default function CreateAirportRoute() {
  const skyLinkService = useSkyLinkService();
  const airportService = useAirportService();
  const navigate = useNavigate();
  const [iataCodeInput, setIataCodeInput] = useState<string>("");
  const [formData, setFormData] =
    useState<CreateAirportFormData>(initialFormData);

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
    });
  };

  const handleGeneralDataChange = (general: CreateAirportFormData["general"]) =>
    setFormData((prev) => ({ ...prev, general }));

  const handleLocationDataChange = (
    location: CreateAirportFormData["location"],
  ) => setFormData((prev) => ({ ...prev, location }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    const newAirport = formDataToApiFormat(formData);
    airportService.createNew(newAirport).then(() => {
      navigate("/airports");
    });
  }

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
                required
              />
              <Button
                className="min-w-fit"
                outline
                onClick={() => {
                  console.log(formData);
                }}
              >
                Fill manually
              </Button>
              <Button className="min-w-fit" onClick={handleCreateWithSkyLink}>
                <span className="pe-1">Fill with</span>
                <span className="font-mono font-bold">SkyLink</span>
              </Button>
            </div>
          </Container>

          <AirportGeneralFormSection
            data={formData.general}
            setData={handleGeneralDataChange}
          />

          <AirportLocationFormSection
            data={formData.location}
            setData={handleLocationDataChange}
          />

          <FormSubmit message="Cannot save airport." button="Create airport" />
        </form>
      </div>
    </ProtectedRoute>
  );
}
