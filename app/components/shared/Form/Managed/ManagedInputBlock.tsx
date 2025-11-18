"use client";

import { Label, TextInput } from "flowbite-react";
import React, { HTMLInputTypeAttribute } from "react";
import { useField } from "formik";
import InputErrorList from "~/components/shared/Form/InputErrorList";

type ManagedInputBlockProps = {
  field: string;
  label: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  disabled?: boolean;
};

export default function ManagedInputBlock({
  field,
  label,
  required = true,
  type = "text",
  disabled = false,
}: ManagedInputBlockProps) {
  const [fieldProps, meta] = useField(field);
  const isError = meta.touched && meta.error;

  return (
    <div className="mb-4 w-full">
      <div className="mb-2 block">
        <Label htmlFor={field} color={isError ? "failure" : undefined}>
          {label}
        </Label>
      </div>
      <TextInput
        id={field}
        type={type}
        required={required}
        color={isError ? "failure" : undefined}
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
