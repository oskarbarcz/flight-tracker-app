import { Label, Select } from "flowbite-react";
import { useField } from "formik";
import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useFormDensity } from "~/shared/ui/Form/formDensity";
import { InputErrorList } from "~/shared/ui/Form/InputErrorList";
import { RequiredMark } from "~/shared/ui/Form/RequiredMark";

type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  className?: string;
  field: string;
  label: string;
  required?: boolean;
  options: SelectOption[];
  disabled?: boolean;
};

export function ManagedSelectBlock({
  className,
  field,
  label,
  required = true,
  options = [],
  disabled = false,
}: Props) {
  const [fieldProps, meta, helpers] = useField(field);
  const isError = meta.touched && meta.error;
  const density = useFormDensity();

  useEffect(() => {
    const isSelectable = options.some((option) => option.value === fieldProps.value);
    if (!isSelectable && options.length > 0) {
      helpers.setValue(options[0].value);
    }
  }, [options, fieldProps.value, helpers]);

  return (
    <div className={twMerge(density.fieldClass, className)}>
      <div className={density.labelClass}>
        <Label htmlFor={field} color={isError ? "failure" : undefined}>
          {label}
          {required && <RequiredMark />}
        </Label>
      </div>
      <Select
        id={field}
        sizing={density.inputSizing}
        required={required}
        disabled={disabled}
        color={isError ? "failure" : undefined}
        {...fieldProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <InputErrorList errorFocus={Boolean(isError)} errors={isError ? [meta.error as string] : []} />
    </div>
  );
}
