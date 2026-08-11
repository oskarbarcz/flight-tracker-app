import { useField, useFormikContext } from "formik";
import React from "react";
import { tonsInput } from "~/features/flight/components/Forms/loadsheetFields";
import type { FlatLoadsheetFormData } from "~/features/flight/form-types";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";

type Props = {
  field: string;
  label: string;
  footnote?: string;
  required?: boolean;
};

function positive(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatEndurance(minutes: number): string {
  const total = Math.round(minutes);

  if (total < 60) {
    return total === 1 ? "1 minute" : `${total} minutes`;
  }

  const hours = Math.floor(total / 60);
  const rest = total % 60;

  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export function FuelTonsInput({ field, label, footnote, required = true }: Props) {
  const { values } = useFormikContext<FlatLoadsheetFormData>();
  const [{ value }] = useField(field);
  const flow = positive(values.averageFuelFlow);
  const tons = positive(value);
  const estimate = flow > 0 ? (tons > 0 ? `~${formatEndurance((tons / flow) * 60)}` : "0 minutes") : undefined;

  return (
    <ManagedFloatingInputBlock
      field={field}
      label={label}
      required={required}
      footnote={footnote ?? estimate}
      {...tonsInput}
    />
  );
}
