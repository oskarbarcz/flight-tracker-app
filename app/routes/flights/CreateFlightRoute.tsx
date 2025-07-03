"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import { Form, redirect, useLoaderData } from "react-router";
import { Route } from "../../../.react-router/types/app/routes/flights/+types/CreateFlightRoute";
import { AirportService } from "~/state/api/airport.service";
import InputBlock from "~/components/BaseComponents/Form/InputBlock";
import getFormData from "~/functions/getFormData";
import { Aircraft, Airport, CreateFlightDto, Operator } from "~/models";
import { UserRole } from "~/models/user.model";
import { OperatorService } from "~/state/api/operator.service";
import { AircraftService } from "~/state/api/aircraft.service";
import SelectBlock from "~/components/BaseComponents/Form/SelectBlock";
import { FlightService } from "~/state/api/flight.service";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<Response | void> {
  const flightService = new FlightService();
  const form = await request.formData();
  const rawFormData = getFormData(form, [
    "aircraftId",
    "operatorId",
    "departureAirportId",
    "destinationAirportId",
    "callsign",
    "flightNumber",
    "offBlockTime",
    "takeoffTime",
    "arrivalTime",
    "onBlockTime",
  ]);

  const flight: CreateFlightDto = {
    departureAirportId: rawFormData.departureAirportId,
    destinationAirportId: rawFormData.destinationAirportId,
    aircraftId: rawFormData.aircraftId,
    operatorId: rawFormData.operatorId,
    callsign: rawFormData.callsign,
    flightNumber: rawFormData.flightNumber,
    timesheet: {
      scheduled: {
        offBlockTime: rawFormData.offBlockTime,
        takeoffTime: rawFormData.takeoffTime,
        arrivalTime: rawFormData.arrivalTime,
        onBlockTime: rawFormData.onBlockTime,
      },
    },
    loadsheets: {
      final: null,
      preliminary: null,
    },
  };

  const created = await flightService.createNew(flight);

  if (created) {
    return redirect(`/flights`);
  }

  console.error("Failed to create flight");
}

type ClientLoaderTypes = {
  airports: Airport[];
  aircraft: Aircraft[];
  operators: Operator[];
};

export async function clientLoader(): Promise<ClientLoaderTypes> {
  const aircraftService = new AircraftService();
  const airportService = new AirportService();
  const operatorService = new OperatorService();

  return {
    airports: await airportService.getAll(),
    aircraft: await aircraftService.getAll(),
    operators: await operatorService.fetchAll(),
  };
}

export default function CreateAirportRoute() {
  usePageTitle("Create new flight");
  const { airports, aircraft, operators } = useLoaderData<ClientLoaderTypes>();

  const airportSelectOptions = airports.map((airport) => ({
    value: airport.id,
    label: `${airport.iataCode} - ${airport.name}`,
  }));

  const aircraftSelectOptions = aircraft.map((aircraft) => ({
    value: aircraft.id,
    label: `${aircraft.registration} - ${aircraft.shortName} - ${aircraft.operator.shortName}`,
  }));

  const operatorSelectOptions = operators.map((operator) => ({
    value: operator.id,
    label: `${operator.icaoCode} - ${operator.shortName}`,
  }));

  const currentDate = new Date();
  currentDate.setSeconds(0, 0);

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Create new flight"
          backText="Back to flights"
          backUrl="/flights"
        />

        <Form className="flex max-w-md flex-col gap-4" method="post">
          <SelectBlock
            htmlName="departureAirportId"
            label="Departure"
            options={airportSelectOptions}
          />
          <SelectBlock
            htmlName="destinationAirportId"
            label="Destination"
            options={airportSelectOptions}
          />
          <SelectBlock
            htmlName="aircraftId"
            label="Aircraft"
            options={aircraftSelectOptions}
          />
          <SelectBlock
            htmlName="operatorId"
            label="Operator"
            options={operatorSelectOptions}
          />
          <InputBlock htmlName="callsign" label="Callsign" />
          <InputBlock htmlName="flightNumber" label="Flight number" />
          <InputBlock
            htmlName="offBlockTime"
            label="Offblock time (UTC)"
            defaultValue={currentDate.toISOString()}
          />
          <InputBlock
            htmlName="takeoffTime"
            label="Takeoff time (UTC)"
            defaultValue={currentDate.toISOString()}
          />
          <InputBlock
            htmlName="arrivalTime"
            label="Arrival time (UTC)"
            defaultValue={currentDate.toISOString()}
          />
          <InputBlock
            htmlName="onBlockTime"
            label="On-block time (UTC)"
            defaultValue={currentDate.toISOString()}
          />

          <Button type="submit">Create new flight</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
