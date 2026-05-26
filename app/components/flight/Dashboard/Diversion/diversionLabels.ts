import { buildEnumLookup } from "~/functions/buildEnumLookup";
import {
  type DiversionReason,
  type DiversionSeverity,
  diversionReasonOptions,
  diversionSeverityOptions,
} from "~/models";

export const diversionSeverityLabel = buildEnumLookup<DiversionSeverity>(diversionSeverityOptions);
export const diversionReasonLabel = buildEnumLookup<DiversionReason>(diversionReasonOptions);
