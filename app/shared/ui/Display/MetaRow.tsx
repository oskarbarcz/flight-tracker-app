import React from "react";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  label: string;
  value: React.ReactNode;
};

export function MetaRow({ label, value }: Props) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
      <FieldLabel>{label}</FieldLabel>
      <span className="ms-auto min-w-0 break-words text-end font-medium text-gray-700 dark:text-gray-200">{value}</span>
    </div>
  );
}
