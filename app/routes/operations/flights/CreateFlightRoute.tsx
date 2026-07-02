import React, { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router";
import { FlightIdentityFormSection } from "~/features/flight/components/FormSection/FlightIdentityFormSection";
import { FlightRouteFormSection } from "~/features/flight/components/FormSection/FlightRouteFormSection";
import { FlightScheduleFormSection } from "~/features/flight/components/FormSection/FlightScheduleFormSection";
import { type CreateFlightFormData, initCreateFlightData } from "~/features/flight/form";
import type { CreateFlightRequest } from "~/features/flight/request";
import { FlightService } from "~/features/flight/service";
import { formDataToApiFormat } from "~/features/flight/transformer";
import { Tracking } from "~/models";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { getFormData } from "~/shared/lib/getFormData";
import { FormSubmit } from "~/shared/ui/Form/FormSubmit";
import { SectionHeaderWithBackButton } from "~/shared/ui/Section/SectionHeaderWithBackButton";
import type { Route } from "../../../../.react-router/types/app/routes/operations/flights/+types/CreateFlightRoute";

export async function clientAction({ request }: Route.ClientActionArgs) {
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
    tracking: Tracking.Disabled,
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
  const [formData, setFormData] = useState<CreateFlightFormData>(initCreateFlightData());
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
  }, [formData.isIdentitySubmitted, formData.isRouteSubmitted, formData.isScheduleSubmitted]);

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
    <div className="mx-auto max-w-2xl pb-4">
      <SectionHeaderWithBackButton sectionTitle="Create new flight" backText="Back to flights" backUrl="/flights" />
      <div className="space-y-4">
        <FlightIdentityFormSection data={formData.identity} onSubmit={onIdentitySubmit} />
        <FlightRouteFormSection data={formData.route} onSubmit={onRouteSubmit} />
        <FlightScheduleFormSection data={formData.schedule} onSubmit={onScheduleSubmit} />

        <FormSubmit message={formMessage} error={formError} onSubmit={handleSubmit} button="Create flight" />
      </div>
    </div>
  );
}
