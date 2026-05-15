import {
  DangerousGoodsClass,
  type Emergency,
  EmergencyCategory,
  EmergencyIntention,
  EmergencySquawk,
  EmergencyThreatLevel,
  EmergencyUrgency,
} from "~/models/emergency.model";
import type { DeclareEmergencyRequest, UpdateEmergencyRequest } from "~/state/api/request/emergency.request";

export type DeclareEmergencyFormData = {
  urgency: EmergencyUrgency;
  threatLevel: EmergencyThreatLevel;
  category: EmergencyCategory;
  squawk: EmergencySquawk | "";
  intention: EmergencyIntention;
  fuelEnduranceMinutes: number;
  dangerousGoodsOnBoard: DangerousGoodsClass[];
  freeText: string;
};

export const emergencyUrgencyOptions = [
  { label: "PAN-PAN — urgency", value: EmergencyUrgency.PanPan },
  { label: "MAYDAY — distress", value: EmergencyUrgency.Mayday },
  { label: "Silent — internal only", value: EmergencyUrgency.Silent },
];

export const emergencyThreatLevelOptions = [
  { label: "Low", value: EmergencyThreatLevel.Low },
  { label: "Medium", value: EmergencyThreatLevel.Medium },
  { label: "High", value: EmergencyThreatLevel.High },
  { label: "Critical", value: EmergencyThreatLevel.Critical },
];

export const emergencyCategoryOptions = [
  { label: "ATA 21 — Air conditioning", value: EmergencyCategory.Ata21AirConditioning },
  { label: "ATA 23 — Communications", value: EmergencyCategory.Ata23Communications },
  { label: "ATA 24 — Electrical power", value: EmergencyCategory.Ata24ElectricalPower },
  { label: "ATA 26 — Fire protection", value: EmergencyCategory.Ata26FireProtection },
  { label: "ATA 27 — Flight controls", value: EmergencyCategory.Ata27FlightControls },
  { label: "ATA 28 — Fuel system", value: EmergencyCategory.Ata28FuelSystem },
  { label: "ATA 29 — Hydraulics", value: EmergencyCategory.Ata29Hydraulics },
  { label: "ATA 30 — Ice / rain protection", value: EmergencyCategory.Ata30IceRainProtection },
  { label: "ATA 32 — Landing gear", value: EmergencyCategory.Ata32LandingGear },
  { label: "ATA 34 — Navigation", value: EmergencyCategory.Ata34Navigation },
  { label: "ATA 35 — Oxygen", value: EmergencyCategory.Ata35Oxygen },
  { label: "ATA 49 — APU", value: EmergencyCategory.Ata49Apu },
  { label: "ATA 52 — Doors", value: EmergencyCategory.Ata52Doors },
  { label: "ATA 72 — Engine", value: EmergencyCategory.Ata72Engine },
  { label: "ATA 73 — Engine fuel control", value: EmergencyCategory.Ata73EngineFuelControl },
  { label: "Cabin decompression", value: EmergencyCategory.CabinDecompression },
  { label: "Smoke or fumes", value: EmergencyCategory.SmokeOrFumes },
  { label: "Bird strike", value: EmergencyCategory.BirdStrike },
  { label: "Severe turbulence", value: EmergencyCategory.SevereTurbulence },
  { label: "Severe weather", value: EmergencyCategory.SevereWeather },
  { label: "Medical emergency", value: EmergencyCategory.MedicalEmergency },
  { label: "Unlawful interference", value: EmergencyCategory.UnlawfulInterference },
  { label: "Security threat", value: EmergencyCategory.SecurityThreat },
  { label: "Unruly passenger", value: EmergencyCategory.UnrulyPassenger },
  { label: "Other", value: EmergencyCategory.Other },
];

export const emergencySquawkOptions: { label: string; value: EmergencySquawk | "" }[] = [
  { label: "— none —", value: "" },
  { label: "7700 — general emergency", value: EmergencySquawk.Distress },
  { label: "7600 — radio failure", value: EmergencySquawk.RadioFailure },
  { label: "7500 — unlawful interference", value: EmergencySquawk.Hijack },
];

export const emergencyIntentionOptions = [
  { label: "Continue", value: EmergencyIntention.Continue },
  { label: "Return to origin", value: EmergencyIntention.Return },
  { label: "Divert", value: EmergencyIntention.Divert },
  { label: "Immediate landing", value: EmergencyIntention.ImmediateLanding },
];

export const dangerousGoodsOptions: { label: string; value: DangerousGoodsClass }[] = [
  { label: "Class 1 — Explosives", value: DangerousGoodsClass.Class1Explosives },
  { label: "Class 2 — Gases", value: DangerousGoodsClass.Class2Gases },
  { label: "Class 3 — Flammable liquids", value: DangerousGoodsClass.Class3FlammableLiquids },
  { label: "Class 4 — Flammable solids", value: DangerousGoodsClass.Class4FlammableSolids },
  { label: "Class 5 — Oxidizers", value: DangerousGoodsClass.Class5Oxidizers },
  { label: "Class 6 — Toxic / infectious", value: DangerousGoodsClass.Class6ToxicInfectious },
  { label: "Class 7 — Radioactive", value: DangerousGoodsClass.Class7Radioactive },
  { label: "Class 8 — Corrosives", value: DangerousGoodsClass.Class8Corrosives },
  { label: "Class 9 — Miscellaneous", value: DangerousGoodsClass.Class9Miscellaneous },
];

export function initDeclareEmergencyData(): DeclareEmergencyFormData {
  return {
    urgency: EmergencyUrgency.PanPan,
    threatLevel: EmergencyThreatLevel.Medium,
    category: EmergencyCategory.Other,
    squawk: "",
    intention: EmergencyIntention.Continue,
    fuelEnduranceMinutes: 0,
    dangerousGoodsOnBoard: [],
    freeText: "",
  };
}

export function emergencyToFormData(emergency: Emergency): DeclareEmergencyFormData {
  return {
    urgency: emergency.urgency,
    threatLevel: emergency.threatLevel,
    category: emergency.category,
    squawk: emergency.squawk ?? "",
    intention: emergency.intention,
    fuelEnduranceMinutes: emergency.fuelEnduranceMinutes,
    dangerousGoodsOnBoard: emergency.dangerousGoodsOnBoard,
    freeText: emergency.freeText,
  };
}

export function declareFormDataToRequest(values: DeclareEmergencyFormData): DeclareEmergencyRequest {
  return {
    urgency: values.urgency,
    threatLevel: values.threatLevel,
    category: values.category,
    squawk: values.squawk === "" ? null : values.squawk,
    intention: values.intention,
    lastKnownPosition: null,
    fuelEnduranceMinutes: Number(values.fuelEnduranceMinutes),
    dangerousGoodsOnBoard: values.dangerousGoodsOnBoard,
    freeText: values.freeText.trim(),
  };
}

export function updateFormDataToRequest(values: DeclareEmergencyFormData): UpdateEmergencyRequest {
  return declareFormDataToRequest(values);
}
