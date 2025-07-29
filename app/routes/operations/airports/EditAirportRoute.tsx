"use client";

import React, { useState } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button, Label, TextInput } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import { redirect, useLoaderData, useNavigate } from "react-router";
import { AirportService } from "~/state/api/airport.service";
import {
  airportToFormData,
  CreateAirportFormData,
  EditAirportRequest,
  formDataToApiFormat,
  GetAirportResponse,
  skyLinkToFormData,
} from "~/models";
import { Route } from "../../../../.react-router/types/app/routes/operations/airports/+types/EditAirportRoute";
import getFormData from "~/functions/getFormData";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import Container from "~/components/Container";
import AirportGeneralFormSection from "~/components/Forms/Airport/AirportGeneralFormSection";
import AirportLocationFormSection from "~/components/Forms/Airport/AirportLocationFormSection";
import FormSubmit from "~/components/Form/Section/FormSubmit";
import { useApi } from "~/state/contexts/api.context";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs): Promise<Response> {
  const airportService = new AirportService();

  const form = await request.formData();
  const airport: EditAirportRequest = getFormData(form, [
    "icaoCode",
    "iataCode",
    "city",
    "name",
    "country",
    "timezone",
  ]);

  await airportService.update(params.id, airport);

  return redirect("/airports");
}

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
  const [isGeneralSubmitted, setIsGeneralSubmitted] = useState<boolean>(false);
  const [isLocationSubmitted, setIsLocationSubmitted] =
    useState<boolean>(false);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

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
      .update(airport.id, newAirport)
      .then(() => {
        navigate("/airports");
      })
      .catch((err: { message: never }) => {
        setFormErrorMessage(err.message);
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

          <FormSubmit message={formErrorMessage} button="Save changes" />
        </form>
      </div>
    </ProtectedRoute>
  );
}
