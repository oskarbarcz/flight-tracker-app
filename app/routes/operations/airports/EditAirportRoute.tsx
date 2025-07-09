"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import { Form, redirect, useLoaderData } from "react-router";
import { AirportService } from "~/state/api/airport.service";
import { Airport, EditAirportDto } from "~/models";
import { Route } from "../../../../.react-router/types/app/routes/operations/airports/+types/EditAirportRoute";
import getFormData from "~/functions/getFormData";
import InputBlock from "~/components/Intrinsic/Form/InputBlock";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs): Promise<Response> {
  const airportService = new AirportService();

  const form = await request.formData();
  const airport: EditAirportDto = getFormData(form, [
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
}: Route.ClientLoaderArgs): Promise<Airport> {
  return new AirportService().getById(params.id);
}

export default function EditAirportRoute() {
  usePageTitle("Edit airport");
  const airport = useLoaderData<Airport>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Edit airport"
          backText="Back to airports"
          backUrl="/airports"
        />

        <Form className="flex max-w-md flex-col gap-4" method="post">
          <InputBlock
            htmlName="icaoCode"
            label="ICAO code"
            defaultValue={airport.icaoCode}
          />
          <InputBlock
            htmlName="iataCode"
            label="IATA code"
            defaultValue={airport.iataCode}
          />
          <InputBlock
            htmlName="name"
            label="Name"
            defaultValue={airport.name}
          />
          <InputBlock
            htmlName="city"
            label="City"
            defaultValue={airport.city}
          />
          <InputBlock
            htmlName="country"
            label="County"
            defaultValue={airport.country}
          />
          <InputBlock
            htmlName="timezone"
            label="Timezone"
            defaultValue={airport.timezone}
          />

          <Button type="submit">Save changes</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
