import { array, mixed, number, type ObjectSchema, object, string } from "yup";
import {
  DangerousGoodsClass,
  EmergencyCategory,
  EmergencyIntention,
  EmergencySquawk,
  EmergencyThreatLevel,
  EmergencyUrgency,
} from "~/models/emergency.model";
import type { DeclareEmergencyFormData } from "~/models/form/emergency.form";

export const declareEmergencySchema: ObjectSchema<DeclareEmergencyFormData> = object({
  urgency: mixed<EmergencyUrgency>().oneOf(Object.values(EmergencyUrgency)).required("Urgency is required"),
  threatLevel: mixed<EmergencyThreatLevel>()
    .oneOf(Object.values(EmergencyThreatLevel))
    .required("Threat level is required"),
  category: mixed<EmergencyCategory>().oneOf(Object.values(EmergencyCategory)).required("Category is required"),
  squawk: mixed<EmergencySquawk | "">()
    .oneOf(["", ...Object.values(EmergencySquawk)])
    .defined(),
  intention: mixed<EmergencyIntention>().oneOf(Object.values(EmergencyIntention)).required("Intention is required"),
  fuelEnduranceMinutes: number()
    .typeError("Fuel endurance must be a number")
    .required("Fuel endurance is required")
    .integer("Must be a whole number")
    .min(0, "Cannot be negative")
    .max(1440, "Maximum 1440 minutes (24h)"),
  dangerousGoodsOnBoard: array()
    .of(mixed<DangerousGoodsClass>().oneOf(Object.values(DangerousGoodsClass)).required())
    .required()
    .default([]),
  freeText: string().required("Description is required").min(3, "Please provide more detail"),
});
