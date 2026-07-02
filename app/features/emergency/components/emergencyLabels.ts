import {
  type DangerousGoodsClass,
  dangerousGoodsOptions,
  type EmergencyCategory,
  type EmergencyIntention,
  type EmergencySquawk,
  type EmergencyThreatLevel,
  type EmergencyUrgency,
  emergencyCategoryOptions,
  emergencyIntentionOptions,
  emergencySquawkOptions,
  emergencyThreatLevelOptions,
  emergencyUrgencyOptions,
} from "~/models";
import { buildEnumLookup } from "~/shared/lib/buildEnumLookup";

export const urgencyLabel = buildEnumLookup<EmergencyUrgency>(emergencyUrgencyOptions);
export const threatLevelLabel = buildEnumLookup<EmergencyThreatLevel>(emergencyThreatLevelOptions);
export const categoryLabel = buildEnumLookup<EmergencyCategory>(emergencyCategoryOptions);
export const squawkLabel = buildEnumLookup<EmergencySquawk>(emergencySquawkOptions);
export const intentionLabel = buildEnumLookup<EmergencyIntention>(emergencyIntentionOptions);
export const dangerousGoodsLabel = buildEnumLookup<DangerousGoodsClass>(dangerousGoodsOptions);
