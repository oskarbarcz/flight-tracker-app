import type { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/CreateAircraftRoute";
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
import { AirframeService } from "~/features/airframe/service";
import { AirportService } from "~/features/airport/service";
import { OperatorService } from "~/features/operator/service";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { FormSubmit } from "~/shared/ui/Form/FormSubmit";
import { SectionHeaderWithBackButton } from "~/shared/ui/Section/SectionHeaderWithBackButton";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [operator, airframes, airports] = await Promise.all([
    new OperatorService().fetchById(params.operatorId),
    new AirframeService().fetchAll(),
    new AirportService().fetchAll(),
  ]);
  return { operator, airframes, airports };
}

export default function CreateAircraftRoute({ params, loaderData }: Route.ComponentProps) {
  usePageTitle("Create new aircraft");

  const { airframes, airports } = loaderData;
  const { aircraftService } = useApi();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AircraftFormData>(initAircraftFormData());
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
      .createNew(params.operatorId, aircraftFormDataToRequest(formData))
      .then(() => navigate(`/operators/${params.operatorId}/fleet`, { viewTransition: true, replace: true }))
      .catch((error: unknown) => {
        setFormError(aircraftRequestError(error));
        setFormMessage(undefined);
      });
  }

  return (
    <div className="mx-auto max-w-lg pb-4">
      <SectionHeaderWithBackButton
        sectionTitle="Create new aircraft"
        backText="Back to fleet"
        backUrl={`/operators/${params.operatorId}/fleet`}
      />
      <div className="space-y-4">
        <AircraftIdentificationFormSection data={formData.identity} airframes={airframes} onSubmit={onIdentitySubmit} />
        <AircraftLifecycleFormSection data={formData.lifecycle} airports={airports} onSubmit={onLifecycleSubmit} />

        <FormSubmit message={formMessage} error={formError} onSubmit={handleSubmit} button="Create new aircraft" />
      </div>
    </div>
  );
}
