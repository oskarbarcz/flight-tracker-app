"use client";

import { FloatingLabel } from "flowbite-react";
import React, {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
} from "react";
import InputErrorList from "~/components/Intrinsic/Form/Partial/InputErrorList";
import { useField } from "formik";
import { twMerge } from "tailwind-merge";

type ManagedFloatingInputBlock = {
  field: string;
  label: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  disabled?: boolean;
  className?: string;
};

export default function ManagedFloatingInputBlock({
  field,
  label,
  required = true,
  autoComplete,
  type = "text",
  disabled = false,
  className = "",
}: ManagedFloatingInputBlock) {
  const [fieldProps, meta] = useField(field);
  const isError = meta.touched && meta.error;

  return (
    <div className={twMerge("w-full", className)}>
      <FloatingLabel
        variant="outlined"
        label={label}
        id={field}
        autoComplete={autoComplete}
        type={type}
        required={required}
        color={isError ? "error" : undefined}
        disabled={disabled}
        {...fieldProps}
      />
      <InputErrorList
        errorFocus={Boolean(isError)}
        errors={isError ? [meta.error as string] : []}
      />
    </div>
  );
}
