"use client";

import { Label, Select } from "flowbite-react";
import React, { useEffect } from "react";
import { useField } from "formik";
import { twMerge } from "tailwind-merge";
import InputErrorList from "~/components/Intrinsic/Form/Partial/InputErrorList";

type SelectOption = {
  value: string;
  label: string;
};

type SelectBlockProps = {
  className?: string;
  field: string;
  label: string;
  required?: boolean;
  options: SelectOption[];
  disabled?: boolean;
};

export default function ManagedSelectBlock({
  className,
  field,
  label,
  required = true,
  options = [],
  disabled = false,
}: SelectBlockProps) {
  const [fieldProps, meta, helpers] = useField(field);
  const isError = meta.touched && meta.error;

  useEffect(() => {
    if (!fieldProps.value && options.length > 0) {
      helpers.setValue(options[0].value);
    }
  }, [options, fieldProps.value, helpers]);

  return (
    <div className={twMerge("w-full", className)}>
      <div className="mb-2 block">
        <Label htmlFor={field}>{label}</Label>
      </div>
      <Select
        id={field}
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
      <InputErrorList
        errorFocus={Boolean(isError)}
        errors={isError ? [meta.error as string] : []}
      />
    </div>
  );
}
