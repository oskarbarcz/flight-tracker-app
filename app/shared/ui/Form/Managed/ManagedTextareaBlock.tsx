import { Label, Textarea } from "flowbite-react";
import { useField } from "formik";
import React from "react";
import { InputErrorList } from "~/shared/ui/Form/InputErrorList";
import { RequiredMark } from "~/shared/ui/Form/RequiredMark";

type Props = {
  field: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
};

export function ManagedTextareaBlock({
  field,
  label,
  placeholder,
  rows = 3,
  required = true,
  disabled = false,
}: Props) {
  const [fieldProps, meta] = useField<string>(field);
  const isError = meta.touched && meta.error;

  return (
    <div className="mb-4 w-full">
      <div className="mb-2 block">
        <Label htmlFor={field} color={isError ? "failure" : undefined}>
          {label}
          {required && <RequiredMark />}
        </Label>
      </div>
      <Textarea
        id={field}
        rows={rows}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        color={isError ? "failure" : undefined}
        {...fieldProps}
      />
      <InputErrorList errorFocus={Boolean(isError)} errors={isError ? [meta.error as string] : []} />
    </div>
  );
}
