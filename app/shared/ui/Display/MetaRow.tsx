import React from "react";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  label: string;
  value: React.ReactNode;
};

export function MetaRow({ label, value }: Props) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <FieldLabel>{label}</FieldLabel>
      <span className="truncate font-medium text-gray-700 dark:text-gray-200">{value}</span>
    </div>
  );
}
