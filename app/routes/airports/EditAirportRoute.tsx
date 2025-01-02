"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton/SectionHeaderWithBackButton";
import { Form, redirect, useLoaderData } from "react-router";
import { AirportService } from "~/state/services/airport.service";
import { Airport } from "~/models";
import { Route } from "../../../.react-router/types/app/routes/airports/+types/EditAirportRoute";
import getFormData from "~/functions/getFormData";
import InputBlock from "~/components/Form/InputBlock";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs): Promise<Response> {
  const form = await request.formData();
  const airport = getFormData(form, [
    "icaoCode",
    "name",
    "country",
    "timezone",
  ]);

  await AirportService.update(params.id, airport);

  return redirect("/airports");
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<Airport | Response> {
  return AirportService.getById(params.id).catch(() => redirect("/sign-in"));
}

export default function EditAirportRoute() {
  const airport = useLoaderData<Airport>();

  return (
    <ProtectedRoute expectedRole={"operations"}>
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
            htmlName="name"
            label="Name"
            defaultValue={airport.name}
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
