"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button, Label, TextInput } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton/SectionHeaderWithBackButton";
import { Form, redirect, useLoaderData } from "react-router";
import { AirportService } from "~/state/services/airport.service";
import { Airport } from "~/models";
import { Route } from "../../../.react-router/types/app/routes/airports/+types/EditAirportRoute";
import getFormData from "~/functions/getFormData";

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
}: Route.ClientLoaderArgs): Promise<Airport> {
  return AirportService.fetchById(params.id);
}

export default function EditAirportRoute() {
  const airport = useLoaderData<typeof clientLoader>();

  return (
    <ProtectedRoute expectedRole={"operations"}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Edit airport"
          backText="Back to airports"
          backUrl="/airports"
        />

        <Form className="flex max-w-md flex-col gap-4" method="post">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="icaoCode" value="ICAO code" />
            </div>
            <TextInput
              id="icaoCode"
              name="icaoCode"
              defaultValue={airport.icaoCode}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Airport name" />
            </div>
            <TextInput
              id="name"
              name="name"
              defaultValue={airport.name}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="country" value="Country" />
            </div>
            <TextInput
              id="country"
              name="country"
              defaultValue={airport.country}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="timezone" value="Timezone" />
            </div>
            <TextInput
              id="timezone"
              name="timezone"
              defaultValue={airport.timezone}
              required
            />
          </div>
          <Button type="submit">Save changes</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
