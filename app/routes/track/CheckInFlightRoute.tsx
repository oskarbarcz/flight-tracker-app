"use client";

import React from "react";
import { FlightStateProvider } from "~/state/contexts/flight.state";
import { Form, Navigate, redirect, useLoaderData } from "react-router";
import { Flight, isFlightTrackable, Timesheet } from "~/models";
import { Route } from "../../../.react-router/types/app/routes/track/+types/CheckInFlightRoute";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import InputBlock from "~/components/Form/InputBlock";
import { Button } from "flowbite-react";
import getFormData from "~/functions/getFormData";
import { UserRole } from "~/models/user.model";
import { FlightService } from "~/state/api/flight.service";

export function meta() {
  return [{ title: "Check in for flight | FlightModel Tracker" }];
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<Flight> {
  const flightService = new FlightService();

  return flightService.fetchFlightById(params.id);
}

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs): Promise<Response> {
  const flightService = new FlightService();
  const form = await request.formData();
  const estimatedTimesheet: Timesheet = getFormData(form, [
    "offBlockTime",
    "takeoffTime",
    "arrivalTime",
    "onBlockTime",
  ]);

  await flightService.checkIn(params.id, estimatedTimesheet);

  return redirect(`/track/${params.id}`);
}

export default function TrackFlightRoute() {
  const flight = useLoaderData<typeof clientLoader>();

  if (flight === undefined) {
    return;
  }

  if (isFlightTrackable(flight.status)) {
    return <Navigate replace={true} to={`/track/${flight.id}`} />;
  }

  const scheduledTimesheet = flight.timesheet.scheduled as Timesheet;

  return (
    <ProtectedRoute expectedRole={UserRole.CabinCrew}>
      <FlightStateProvider>
        <div className="mx-auto w-1/2">
          <Form className="flex max-w-md flex-col gap-4" method="post">
            <InputBlock
              htmlName="offBlockTime"
              label="offBlockTime"
              defaultValue={scheduledTimesheet.offBlockTime}
            />
            <InputBlock
              htmlName="takeoffTime"
              label="takeoffTime"
              defaultValue={scheduledTimesheet.takeoffTime}
            />
            <InputBlock
              htmlName="arrivalTime"
              label="arrivalTime"
              defaultValue={scheduledTimesheet.arrivalTime}
            />
            <InputBlock
              htmlName="onBlockTime"
              label="onBlockTime"
              defaultValue={scheduledTimesheet.onBlockTime}
            />

            <Button type="submit">
              Check in for flight {flight.flightNumber}
            </Button>
          </Form>
        </div>
      </FlightStateProvider>
    </ProtectedRoute>
  );
}
