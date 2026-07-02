import type { ApiCoordinates, ApiEmergencyResponse } from "~/features/emergency/request";

export enum EmergencyUrgency {
  Mayday = "mayday",
  PanPan = "panpan",
  Silent = "silent",
}

export enum EmergencyThreatLevel {
  Low = "low",
  Medium = "medium",
  High = "high",
  Critical = "critical",
}

export enum EmergencyCategory {
  Ata21AirConditioning = "ata-21-air-conditioning",
  Ata23Communications = "ata-23-communications",
  Ata24ElectricalPower = "ata-24-electrical-power",
  Ata26FireProtection = "ata-26-fire-protection",
  Ata27FlightControls = "ata-27-flight-controls",
  Ata28FuelSystem = "ata-28-fuel-system",
  Ata29Hydraulics = "ata-29-hydraulics",
  Ata30IceRainProtection = "ata-30-ice-rain-protection",
  Ata32LandingGear = "ata-32-landing-gear",
  Ata34Navigation = "ata-34-navigation",
  Ata35Oxygen = "ata-35-oxygen",
  Ata49Apu = "ata-49-apu",
  Ata52Doors = "ata-52-doors",
  Ata72Engine = "ata-72-engine",
  Ata73EngineFuelControl = "ata-73-engine-fuel-control",
  CabinDecompression = "cabin-decompression",
  SmokeOrFumes = "smoke-or-fumes",
  BirdStrike = "bird-strike",
  SevereTurbulence = "severe-turbulence",
  SevereWeather = "severe-weather",
  MedicalEmergency = "medical-emergency",
  UnlawfulInterference = "unlawful-interference",
  SecurityThreat = "security-threat",
  UnrulyPassenger = "unruly-passenger",
  Other = "other",
}

export enum EmergencySquawk {
  Distress = "7700",
  RadioFailure = "7600",
  Hijack = "7500",
}

export enum EmergencyIntention {
  Continue = "continue",
  Return = "return",
  Divert = "divert",
  ImmediateLanding = "immediate-landing",
}

export enum DangerousGoodsClass {
  Class1Explosives = "class-1-explosives",
  Class2Gases = "class-2-gases",
  Class3FlammableLiquids = "class-3-flammable-liquids",
  Class4FlammableSolids = "class-4-flammable-solids",
  Class5Oxidizers = "class-5-oxidizers",
  Class6ToxicInfectious = "class-6-toxic-infectious",
  Class7Radioactive = "class-7-radioactive",
  Class8Corrosives = "class-8-corrosives",
  Class9Miscellaneous = "class-9-miscellaneous",
}

export type EmergencyParticipant = {
  id: string;
  name: string;
};

export class Emergency {
  id: string;
  urgency: EmergencyUrgency;
  threatLevel: EmergencyThreatLevel;
  category: EmergencyCategory;
  squawk: EmergencySquawk | null;
  intention: EmergencyIntention;
  lastKnownPosition: ApiCoordinates | null;
  soulsOnBoard: number;
  fuelEnduranceMinutes: number;
  dangerousGoodsOnBoard: DangerousGoodsClass[];
  freeText: string;
  declarationTime: Date;
  reportedBy: EmergencyParticipant;
  resolvedAt: Date | null;
  resolvedBy: EmergencyParticipant | null;

  constructor(data: ApiEmergencyResponse) {
    this.id = data.id;
    this.urgency = data.urgency;
    this.threatLevel = data.threatLevel;
    this.category = data.category;
    this.squawk = data.squawk;
    this.intention = data.intention;
    this.lastKnownPosition = data.lastKnownPosition;
    this.soulsOnBoard = data.soulsOnBoard;
    this.fuelEnduranceMinutes = data.fuelEnduranceMinutes;
    this.dangerousGoodsOnBoard = data.dangerousGoodsOnBoard;
    this.freeText = data.freeText;
    this.declarationTime = new Date(data.declarationTime);
    this.reportedBy = data.reportedBy;
    this.resolvedAt = data.resolvedAt ? new Date(data.resolvedAt) : null;
    this.resolvedBy = data.resolvedBy;
  }

  get isActive(): boolean {
    return this.resolvedAt === null;
  }
}
