import type { GsxSettingsResponse } from "~/features/user/request";

export type GsxSetting = keyof GsxSettingsResponse;

export type GsxPassengerFlow = "boarding" | "deboarding";

export const gsxSectionId = "gsx";
export const gsxSettingsPath = `/me/account#${gsxSectionId}`;

export const gsxIntegration = {
  label: "GSX integration",
  note: "The Transponder can read GSX on your PC and move your flight along.",
  hintWhenOff: "Turn this on to use the settings below.",
} as const;

export const gsxAutomations: {
  setting: GsxSetting;
  flow: GsxPassengerFlow;
  label: string;
  description: string;
}[] = [
  {
    setting: "autoBoardingEnabled",
    flow: "boarding",
    label: "Automatic boarding",
    description: "Request boarding in GSX and your flight moves to Boarding.",
  },
  {
    setting: "autoDeboardingEnabled",
    flow: "deboarding",
    label: "Automatic deboarding",
    description: "Request deboarding in GSX and your flight moves to Offboarding.",
  },
];

export const gsxLoadFailureMessage = "GSX settings could not be loaded. Reload the page to try again.";
