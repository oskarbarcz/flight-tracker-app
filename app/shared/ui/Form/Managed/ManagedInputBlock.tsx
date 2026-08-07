import { HelperText, Label, TextInput } from "flowbite-react";
import { useField } from "formik";
import React, { type HTMLInputTypeAttribute } from "react";
import { useFormDensity } from "~/shared/ui/Form/formDensity";
import { InputErrorList } from "~/shared/ui/Form/InputErrorList";
import { RequiredMark } from "~/shared/ui/Form/RequiredMark";

type Props = {
  field: string;
  label: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  disabled?: boolean;
  autoComplete?: string;
  helperText?: string;
  autoFocus?: boolean;
};

export function ManagedInputBlock({
  field,
  label,
  required = true,
  type = "text",
  disabled = false,
  autoComplete,
  helperText,
  autoFocus = false,
}: Props) {
  const [fieldProps, meta] = useField(field);
  const isError = meta.touched && meta.error;
  const density = useFormDensity();

  return (
    <div className={density.fieldClass}>
      <div className={density.labelClass}>
        <Label htmlFor={field} color={isError ? "failure" : undefined}>
          {label}
          {required && <RequiredMark />}
        </Label>
      </div>
      <TextInput
        id={field}
        type={type}
        sizing={density.inputSizing}
        required={required}
        color={isError ? "failure" : undefined}
        disabled={disabled}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        {...fieldProps}
      />
      {helperText && !isError && <HelperText>{helperText}</HelperText>}
      <InputErrorList errorFocus={Boolean(isError)} errors={isError ? [meta.error as string] : []} />
    </div>
  );
}
