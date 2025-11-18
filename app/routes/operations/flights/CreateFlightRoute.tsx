"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithBackButton from "~/components/shared/Section/SectionHeaderWithBackButton";
import { redirect, useNavigate } from "react-router";
import { Route } from "../../../../.react-router/types/app/routes/operations/flights/+types/CreateFlightRoute";
import getFormData from "~/functions/getFormData";
import { UserRole } from "~/models/user.model";
import { FlightService } from "~/state/api/flight.service";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { CreateFlightRequest } from "~/state/api/model/flight.dto";
import FormSubmit from "~/components/shared/Form/FormSubmit";
import FlightRouteFormSection from "~/components/flight/FormSection/FlightRouteFormSection";
import FlightScheduleFormSection from "~/components/flight/FormSection/FlightScheduleFormSection";
import {
  CreateFlightFormData,
  initCreateFlightData,
} from "~/models/form/flight.form";
import FlightIdentityFormSection from "~/components/flight/FormSection/FlightIdentityFormSection";
import { useApi } from "~/state/contexts/content/api.context";
import { formDataToApiFormat } from "~/state/api/transformer/flight.transformer";

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

  const flight: CreateFlightRequest = {
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

export default function CreateAirportRoute() {
  usePageTitle("Create new flight");
  const [formData, setFormData] = useState<CreateFlightFormData>(
    initCreateFlightData(),
  );
  const [formMessage, setFormMessage] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const { flightService } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const isAllSubmitted = [
      formData.isRouteSubmitted,
      formData.isScheduleSubmitted,
      formData.isIdentitySubmitted,
    ].every((isSubmitted) => isSubmitted);

    const formMessage = isAllSubmitted ? undefined : "Save all sections first.";
    setFormMessage(formMessage);
  }, [
    formData.isIdentitySubmitted,
    formData.isRouteSubmitted,
    formData.isScheduleSubmitted,
  ]);

  const handleSubmit = () => {
    const flight = formDataToApiFormat(formData);
    flightService
      .createNew(flight)
      .then(() => {
        navigate("/flights", {
          viewTransition: true,
        });
      })
      .catch((err: { message: never }) => {
        setFormError(err.message);
        setFormMessage(undefined);
      });
  };

  function onRouteSubmit(route: CreateFlightFormData["route"]) {
    setFormData((prev) => ({
      ...prev,
      route,
      isRouteSubmitted: true,
    }));
    setFormError(undefined);
  }

  function onScheduleSubmit(schedule: CreateFlightFormData["schedule"]) {
    setFormData((prev) => ({
      ...prev,
      schedule,
      isScheduleSubmitted: true,
    }));
    setFormError(undefined);
  }

  function onIdentitySubmit(identity: CreateFlightFormData["identity"]) {
    setFormData((prev) => ({
      ...prev,
      identity,
      isIdentitySubmitted: true,
    }));
    setFormError(undefined);
  }

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Create new flight"
          backText="Back to flights"
          backUrl="/flights"
        />
        <div className="space-y-4">
          <FlightIdentityFormSection
            data={formData.identity}
            onSubmit={onIdentitySubmit}
          />
          <FlightRouteFormSection
            data={formData.route}
            onSubmit={onRouteSubmit}
          />
          <FlightScheduleFormSection
            data={formData.schedule}
            onSubmit={onScheduleSubmit}
          />

          <FormSubmit
            message={formMessage}
            error={formError}
            onSubmit={handleSubmit}
            button="Create flight"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
