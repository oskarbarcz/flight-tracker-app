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

function buildLookup<T extends string>(options: { value: T | ""; label: string }[]): (value: T) => string {
  const map = new Map(options.map((o) => [o.value as string, o.label]));
  return (value: T) => map.get(value) ?? value;
}

export const urgencyLabel = buildLookup<EmergencyUrgency>(emergencyUrgencyOptions);
export const threatLevelLabel = buildLookup<EmergencyThreatLevel>(emergencyThreatLevelOptions);
export const categoryLabel = buildLookup<EmergencyCategory>(emergencyCategoryOptions);
export const squawkLabel = buildLookup<EmergencySquawk>(emergencySquawkOptions);
export const intentionLabel = buildLookup<EmergencyIntention>(emergencyIntentionOptions);
export const dangerousGoodsLabel = buildLookup<DangerousGoodsClass>(dangerousGoodsOptions);
