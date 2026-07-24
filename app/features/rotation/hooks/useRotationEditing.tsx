import { useState } from "react";
import { useToast } from "~/app-state/useToast";
import type { Rotation } from "~/features/rotation";
import { type LegFormData, legFormDataToAddRequest, legFormDataToUpdateRequest } from "~/features/rotation/form";
import type { CreateRotationRequest, EditRotationRequest } from "~/features/rotation/request";
import { useApi } from "~/shared/api/useApi";

export function useRotationEditing(initial: Rotation | null) {
  const { rotationService } = useApi();
  const { error } = useToast();
  const [rotation, setRotation] = useState<Rotation | null>(initial);

  const apply = async (action: () => Promise<Rotation>): Promise<boolean> => {
    if (!rotation) {
      return false;
    }
    try {
      setRotation(await action());
      return true;
    } catch (mutationError) {
      error((mutationError as { message?: string })?.message ?? "The action could not be completed.");
      try {
        setRotation(await rotationService.fetchById(rotation.id));
      } catch {}
      return false;
    }
  };

  return {
    rotation,
    createDraft: async (operatorId: string, values: CreateRotationRequest): Promise<boolean> => {
      try {
        setRotation(await rotationService.create(operatorId, values));
        return true;
      } catch (creationError) {
        error((creationError as { message?: string })?.message ?? "Could not create the rotation.");
        return false;
      }
    },
    editRotation: (data: EditRotationRequest) => apply(() => rotationService.update((rotation as Rotation).id, data)),
    removeRotation: async (): Promise<boolean> => {
      if (!rotation) {
        return false;
      }
      try {
        await rotationService.remove(rotation.id);
        return true;
      } catch (removalError) {
        error((removalError as { message?: string })?.message ?? "Could not remove the rotation.");
        return false;
      }
    },
    addLeg: (data: LegFormData) =>
      apply(() => rotationService.addLeg((rotation as Rotation).id, legFormDataToAddRequest(data))),
    updateLeg: (legId: string, data: LegFormData) =>
      apply(() => rotationService.updateLeg((rotation as Rotation).id, legId, legFormDataToUpdateRequest(data))),
    removeLeg: (legId: string) => apply(() => rotationService.removeLeg((rotation as Rotation).id, legId)),
    attachFlight: (legId: string, flightId: string) =>
      apply(() => rotationService.attachFlight((rotation as Rotation).id, legId, flightId)),
    detachFlight: (legId: string) => apply(() => rotationService.detachFlight((rotation as Rotation).id, legId)),
    markReady: () => apply(() => rotationService.markReady((rotation as Rotation).id)),
  };
}
