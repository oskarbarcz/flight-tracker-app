import type { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/EditAircraftRoute";
import React from "react";
import { useNavigate } from "react-router";
import { useToast } from "~/app-state/useToast";
import { useAircraftDetails } from "~/features/aircraft/components/AircraftDetails/aircraftDetailsContext";
import { UpdateAirframeDataModal } from "~/features/aircraft/components/AircraftDetails/UpdateAirframeDataModal";
import { aircraftRequestError, aircraftValuesToRequest } from "~/features/aircraft/form";
import type { AircraftFormValues } from "~/features/aircraft/schema";
import { useApi } from "~/shared/api/useApi";

export default function EditAircraftRoute({ params }: Route.ComponentProps) {
  const { aircraft, refresh } = useAircraftDetails();
  const { aircraftService } = useApi();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const close = () =>
    navigate(`/operators/${params.operatorId}/aircraft/${params.aircraftId}`, { viewTransition: true });

  const save = async (values: AircraftFormValues) => {
    try {
      await aircraftService.update(params.operatorId, params.aircraftId, aircraftValuesToRequest(values));
      success(`${values.registration} was updated.`);
      refresh();
      close();
    } catch (reason) {
      error(aircraftRequestError(reason));
    }
  };

  return <UpdateAirframeDataModal aircraft={aircraft} save={save} cancel={close} />;
}
