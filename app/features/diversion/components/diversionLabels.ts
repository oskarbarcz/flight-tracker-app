import {
  type DiversionReason,
  type DiversionSeverity,
  diversionReasonOptions,
  diversionSeverityOptions,
} from "~/models";
import { buildEnumLookup } from "~/shared/lib/buildEnumLookup";

export const diversionSeverityLabel = buildEnumLookup<DiversionSeverity>(diversionSeverityOptions);
export const diversionReasonLabel = buildEnumLookup<DiversionReason>(diversionReasonOptions);
