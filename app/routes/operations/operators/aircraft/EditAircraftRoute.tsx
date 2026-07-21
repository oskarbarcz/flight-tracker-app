import type { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/EditAircraftRoute";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AircraftIdentificationFormSection } from "~/features/aircraft/components/Form/AircraftIdentificationFormSection";
import { AircraftLifecycleFormSection } from "~/features/aircraft/components/Form/AircraftLifecycleFormSection";
import {
  type AircraftFormData,
  aircraftFormDataToRequest,
  aircraftRequestError,
  initAircraftFormData,
} from "~/features/aircraft/form";
import type { AircraftIdentityFormValues, AircraftLifecycleFormValues } from "~/features/aircraft/schema";
import { AircraftService } from "~/features/aircraft/service";
import { AirframeService } from "~/features/airframe/service";
import { AirportService } from "~/features/airport/service";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { FormSubmit } from "~/shared/ui/Form/FormSubmit";
import { SectionHeaderWithBackButton } from "~/shared/ui/Section/SectionHeaderWithBackButton";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [aircraft, airframes, airports] = await Promise.all([
    new AircraftService().fetchById(params.operatorId, params.aircraftId),
    new AirframeService().fetchAll(),
    new AirportService().fetchAll(),
  ]);
  return { aircraft, airframes, airports };
}

export default function EditAircraftRoute({ params, loaderData }: Route.ComponentProps) {
  usePageTitle("Edit aircraft");

  const { aircraft, airframes, airports } = loaderData;
  const { aircraftService } = useApi();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AircraftFormData>(initAircraftFormData(aircraft));
  const [formMessage, setFormMessage] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();

  useEffect(() => {
    const allSubmitted = formData.isIdentitySubmitted && formData.isLifecycleSubmitted;
    setFormMessage(allSubmitted ? undefined : "Save all sections first.");
  }, [formData.isIdentitySubmitted, formData.isLifecycleSubmitted]);

  function onIdentitySubmit(identity: AircraftIdentityFormValues) {
    setFormData((prev) => ({ ...prev, identity, isIdentitySubmitted: true }));
    setFormError(undefined);
  }

  function onLifecycleSubmit(lifecycle: AircraftLifecycleFormValues) {
    setFormData((prev) => ({ ...prev, lifecycle, isLifecycleSubmitted: true }));
    setFormError(undefined);
  }

  function handleSubmit() {
    aircraftService
      .update(params.operatorId, params.aircraftId, aircraftFormDataToRequest(formData))
      .then(() => navigate(`/operators/${params.operatorId}/fleet`, { viewTransition: true, replace: true }))
      .catch((error: unknown) => {
        setFormError(aircraftRequestError(error));
        setFormMessage(undefined);
      });
  }

  return (
    <div className="mx-auto max-w-lg pb-4">
      <SectionHeaderWithBackButton
        sectionTitle="Edit aircraft"
        backText="Back to fleet"
        backUrl={`/operators/${params.operatorId}/fleet`}
      />
      <div className="space-y-4">
        <AircraftIdentificationFormSection
          data={formData.identity}
          airframes={airframes}
          defaultEditable={false}
          onSubmit={onIdentitySubmit}
        />
        <AircraftLifecycleFormSection
          data={formData.lifecycle}
          airports={airports}
          defaultEditable={false}
          onSubmit={onLifecycleSubmit}
        />

        <FormSubmit message={formMessage} error={formError} onSubmit={handleSubmit} button="Save changes" />
      </div>
    </div>
  );
}
