"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton/SectionHeaderWithBackButton";
import { Form, redirect } from "react-router";
import { Route } from "../../../.react-router/types/app/routes/airports/+types/CreateAirportRoute";
import { AirportService } from "~/state/services/airport.service";
import InputBlock from "~/components/Form/InputBlock";

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

  await AirportService.createNew(newAirport);

  return redirect("/airports");
}

export default function CreateAirportRoute() {
  return (
    <ProtectedRoute expectedRole={"operations"}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Create new airport"
          backText="Back to airports"
          backUrl="/airports"
        />

        <Form className="flex max-w-md flex-col gap-4" method="post">
          <InputBlock htmlName="icaoCode" label="ICAO code" />
          <InputBlock htmlName="name" label="Name" />
          <InputBlock htmlName="country" label="County" />
          <InputBlock htmlName="timezone" label="Timezone" />

          <Button type="submit">Create new airport</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
