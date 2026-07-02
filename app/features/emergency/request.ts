import type {
  DangerousGoodsClass,
  EmergencyCategory,
  EmergencyIntention,
  EmergencyParticipant,
  EmergencySquawk,
  EmergencyThreatLevel,
  EmergencyUrgency,
} from "~/features/emergency/model";

export type ApiCoordinates = {
  latitude: number;
  longitude: number;
};

export type ApiEmergencyResponse = {
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
  declarationTime: string;
  reportedBy: EmergencyParticipant;
  resolvedAt: string | null;
  resolvedBy: EmergencyParticipant | null;
};

export type DeclareEmergencyRequest = {
  urgency: EmergencyUrgency;
  threatLevel: EmergencyThreatLevel;
  category: EmergencyCategory;
  squawk: EmergencySquawk | null;
  intention: EmergencyIntention;
  lastKnownPosition: ApiCoordinates | null;
  fuelEnduranceMinutes: number;
  dangerousGoodsOnBoard: DangerousGoodsClass[];
  freeText: string;
};

export type UpdateEmergencyRequest = Partial<DeclareEmergencyRequest>;
