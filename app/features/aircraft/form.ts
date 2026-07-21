import type { Aircraft } from "~/features/aircraft/model";
import {
  type AircraftIdentityFormValues,
  type AircraftLifecycleFormValues,
  notEtopsCertified,
} from "~/features/aircraft/schema";
import type { CreateAircraftRequest } from "~/features/operator/request";

export type AircraftFormData = {
  isIdentitySubmitted: boolean;
  isLifecycleSubmitted: boolean;
  identity: AircraftIdentityFormValues;
  lifecycle: AircraftLifecycleFormValues;
};

export function initAircraftFormData(aircraft?: Aircraft): AircraftFormData {
  return {
    isIdentitySubmitted: aircraft !== undefined,
    isLifecycleSubmitted: aircraft !== undefined,
    identity: {
      type: aircraft?.airframe.type ?? "",
      registration: aircraft?.registration ?? "",
      selcal: aircraft?.selcal ?? "",
    },
    lifecycle: {
      baseAirportId: aircraft?.baseAirport?.id ?? "",
      livery: aircraft?.livery ?? "",
      etopsThresholdMinutes: aircraft?.etopsThresholdMinutes?.toString() ?? notEtopsCertified,
    },
  };
}

export function aircraftRequestError(error: unknown): string {
  const err = error as { message?: string; violations?: Record<string, string[]> };
  const violation = err.violations ? Object.values(err.violations).flat()[0] : undefined;
  return violation ?? err.message ?? "Failed to save aircraft.";
}

export function aircraftFormDataToRequest(formData: AircraftFormData): CreateAircraftRequest {
  const { identity, lifecycle } = formData;
  return {
    type: identity.type,
    registration: identity.registration,
    selcal: identity.selcal || null,
    livery: lifecycle.livery || undefined,
    baseAirportId: lifecycle.baseAirportId || null,
    etopsThresholdMinutes:
      lifecycle.etopsThresholdMinutes === notEtopsCertified ? null : Number(lifecycle.etopsThresholdMinutes),
  };
}
