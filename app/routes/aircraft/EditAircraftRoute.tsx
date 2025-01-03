"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton/SectionHeaderWithBackButton";
import { Form, redirect, useLoaderData } from "react-router";
import { Aircraft, CreateAircraftDto } from "~/models";
import { Route } from "../../../.react-router/types/app/routes/aircraft/+types/EditAircraftRoute";
import { AircraftService } from "~/state/services/aircraft.service";
import InputBlock from "~/components/Form/InputBlock";
import getFormData from "~/functions/getFormData";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs): Promise<Response> {
  const form = await request.formData();
  const aircraft = getFormData<CreateAircraftDto>(form, [
    "icaoCode",
    "shortName",
    "fullName",
    "selcal",
    "registration",
    "livery",
  ]);

  await AircraftService.update(params.id, aircraft);

  return redirect("/aircraft");
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<Aircraft | Response> {
  return AircraftService.getById(params.id).catch(() => redirect("/sign-in"));
}

export default function EditAircraftRoute() {
  const aircraft = useLoaderData<Aircraft>();

  return (
    <ProtectedRoute expectedRole={"operations"}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Edit aircraft"
          backText="Back to aircrafts"
          backUrl="/aircraft"
        />

        <Form className="flex max-w-md flex-col gap-4" method="post">
          <InputBlock
            htmlName="icaoCode"
            label="ICAO code"
            defaultValue={aircraft.icaoCode}
          />
          <InputBlock
            htmlName="shortName"
            label="Short name"
            defaultValue={aircraft.shortName}
          />
          <InputBlock
            htmlName="fullName"
            label="Full name"
            defaultValue={aircraft.fullName}
          />
          <InputBlock
            htmlName="selcal"
            label="SELCAL"
            defaultValue={aircraft.selcal}
          />
          <InputBlock
            htmlName="registration"
            label="Registration"
            defaultValue={aircraft.registration}
          />
          <InputBlock
            htmlName="livery"
            label="Livery"
            defaultValue={aircraft.livery}
          />

          <Button type="submit">Save changes</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
