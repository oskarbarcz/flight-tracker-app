import { FloatingLabel, HelperText } from "flowbite-react";
import { useField } from "formik";
import React, { type HTMLInputAutoCompleteAttribute, type HTMLInputTypeAttribute, type ReactNode } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { InputErrorList } from "~/shared/ui/Form/InputErrorList";

type ManagedFloatingInputBlock = {
  field: string;
  label: string;
  required?: boolean;
  helperText?: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  disabled?: boolean;
  className?: string;
  unit?: string;
  errors?: string[];
};

const hideSpinnerClasses =
  "[&_input]:[appearance:textfield] [&_input::-webkit-outer-spin-button]:appearance-none [&_input::-webkit-inner-spin-button]:appearance-none [&_input::-webkit-inner-spin-button]:m-0";

export function ManagedFloatingInputBlock({
  field,
  label,
  required = true,
  autoComplete,
  type = "text",
  helperText,
  disabled = false,
  className = "",
  unit,
  errors = [],
}: ManagedFloatingInputBlock) {
  const [fieldProps, meta] = useField(field);
  const clientError = meta.touched && meta.error ? [meta.error] : [];
  const displayedErrors = [...new Set([...clientError, ...errors])];
  const isError = displayedErrors.length > 0;

  const labelContent: ReactNode = required ? (
    <>
      {label}
      <span className="text-red-500"> *</span>
    </>
  ) : (
    label
  );

  return (
    <div className={twMerge("w-full", className)}>
      <div className={twMerge("relative", unit && "[&_input]:pe-9", unit && hideSpinnerClasses)}>
        <FloatingLabel
          variant="outlined"
          label={labelContent as unknown as string}
          id={field}
          autoComplete={autoComplete}
          type={type}
          required={required}
          className="whitespace-nowrap dark:bg-gray-800"
          color={isError ? "error" : undefined}
          disabled={disabled}
          {...fieldProps}
        />
        {unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>
      <InputErrorList errorFocus={isError} errors={displayedErrors} />
      {helperText && (
        <HelperText className="text-xs px-1 flex items-center gap-2">
          <FaInfoCircle />
          {helperText}
        </HelperText>
      )}
    </div>
  );
}
