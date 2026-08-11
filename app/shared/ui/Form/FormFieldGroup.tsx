import React from "react";
import { FormSectionLabel } from "~/shared/ui/Form/FormSectionLabel";

type Props = {
  label: string;
  children: React.ReactNode;
};

export function FormFieldGroup({ label, children }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <FormSectionLabel>{label}</FormSectionLabel>
      {children}
    </div>
  );
}
