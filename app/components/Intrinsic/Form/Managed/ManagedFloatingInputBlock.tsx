"use client";

import { FloatingLabel, HelperText } from "flowbite-react";
import React, {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
} from "react";
import InputErrorList from "~/components/Intrinsic/Form/Partial/InputErrorList";
import { useField } from "formik";
import { twMerge } from "tailwind-merge";
import { FaInfoCircle } from "react-icons/fa";

type ManagedFloatingInputBlock = {
  field: string;
  label: string;
  required?: boolean;
  helperText?: string;
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
  helperText,
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
        className="dark:bg-gray-800"
        color={isError ? "error" : undefined}
        disabled={disabled}
        {...fieldProps}
      />
      <InputErrorList
        errorFocus={Boolean(isError)}
        errors={isError ? [meta.error as string] : []}
      />
      {helperText && (
        <HelperText className="text-xs px-1 flex items-center gap-2">
          <FaInfoCircle />
          {helperText}
        </HelperText>
      )}
    </div>
  );
}
