import {
  type DiversionReason,
  type DiversionSeverity,
  diversionReasonOptions,
  diversionSeverityOptions,
} from "~/models";

function buildLookup<T extends string>(options: { value: T; label: string }[]): (value: T) => string {
  const map = new Map(options.map((o) => [o.value as string, o.label]));
  return (value: T) => map.get(value) ?? value;
}

export const diversionSeverityLabel = buildLookup<DiversionSeverity>(diversionSeverityOptions);
export const diversionReasonLabel = buildLookup<DiversionReason>(diversionReasonOptions);
