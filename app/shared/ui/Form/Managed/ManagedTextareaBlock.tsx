import { Label, Textarea } from "flowbite-react";
import { useField } from "formik";
import React from "react";
import { twMerge } from "tailwind-merge";
import { useFormDensity } from "~/shared/ui/Form/formDensity";
import { InputErrorList } from "~/shared/ui/Form/InputErrorList";
import { RequiredMark } from "~/shared/ui/Form/RequiredMark";

type Props = {
  className?: string;
  field: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
};

export function ManagedTextareaBlock({
  className,
  field,
  label,
  placeholder,
  rows = 3,
  required = true,
  disabled = false,
}: Props) {
  const [fieldProps, meta] = useField<string>(field);
  const isError = meta.touched && meta.error;
  const density = useFormDensity();

  return (
    <div className={twMerge(density.fieldClass, className)}>
      <div className={density.labelClass}>
        <Label htmlFor={field} color={isError ? "failure" : undefined}>
          {label}
          {required && <RequiredMark />}
        </Label>
      </div>
      <Textarea
        id={field}
        className={density.textareaClass}
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
