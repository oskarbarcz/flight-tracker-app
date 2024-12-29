"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button, Label, TextInput } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton/SectionHeaderWithBackButton";
import { Form, redirect } from "react-router";
import { Route } from "../../../.react-router/types/app/routes/airports/+types/CreateAirportRoute";
import { AirportService } from "~/state/services/airport.service";

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<Response> {
  const formData = await request.formData();
  const newAirport = {
    icaoCode: formData.get("icaoCode") as string,
    name: formData.get("name") as string,
    country: formData.get("country") as string,
    timezone: formData.get("timezone") as string,
  };

  await AirportService.createNewAirport(newAirport);

  return redirect("/airports");
}

export default function CreateAirportRoute() {
  return (
    <ProtectedRoute expectedRole={"operations"}>
      <div className="max-w-md mx-auto pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Create new airport"
          backText="Back to airports"
          backUrl="/airports"
        />

        <Form className="flex max-w-md flex-col gap-4" method="post">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="icaoCode" value="ICAO code" />
            </div>
            <TextInput id="icaoCode" name="icaoCode" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Airport name" />
            </div>
            <TextInput id="name" name="name" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="country" value="Country" />
            </div>
            <TextInput id="country" name="country" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="timezone" value="Timezone" />
            </div>
            <TextInput id="timezone" name="timezone" required />
          </div>
          <Button type="submit">Create new airport</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
