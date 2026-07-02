import { FloatingLabel } from "flowbite-react";
import { useField } from "formik";
import React, { type HTMLInputAutoCompleteAttribute, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { InputErrorList } from "~/components/shared/Form/InputErrorList";
import { RequiredMark } from "~/components/shared/Form/RequiredMark";
import { formatDate } from "~/shared/lib/time";

type Props = {
  className?: string;
  field: string;
  label: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  defaultValue?: Date;
  required?: boolean;
  disabled?: boolean;
};

const parseDateTime = (dateTimeString: string): Date | null => {
  try {
    const [datePart, timePart] = dateTimeString.split(" ");
    if (!datePart || !timePart) return null;

    const [day, month, year] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);

    if (!day || !month || !year || hours === undefined || minutes === undefined) {
      return null;
    }

    return new Date(Date.UTC(year, month - 1, day, hours, minutes));
  } catch {
    return null;
  }
};

export function ManagedDateTimeInputBlock({
  className,
  field,
  label,
  autoComplete,
  defaultValue,
  required = true,
  disabled = false,
}: Props) {
  const [fieldProps, meta, helpers] = useField(field);
  const [inputValue, setInputValue] = useState<string>(
    fieldProps.value instanceof Date ? formatDate(fieldProps.value) : "",
  );
  const isError = meta.touched && meta.error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      const parsedDate = parseDateTime(inputValue);
      helpers.setValue(parsedDate);
    } catch (error) {
      console.error("Invalid date format:", error);
    }
    fieldProps.onBlur(e);
  };

  useEffect(() => {
    if (fieldProps.value instanceof Date) {
      setInputValue(formatDate(fieldProps.value));
    }

    if (defaultValue) {
      setInputValue(formatDate(defaultValue));
    }
  }, [defaultValue, fieldProps.value]);

  return (
    <div className={twMerge("w-full", className)}>
      <div className="relative">
        <FloatingLabel
          variant="outlined"
          label={label}
          id={field}
          type="text"
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          color={isError ? "error" : undefined}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="DD-MM-YYYY HH:mm"
          className="dark:bg-gray-800"
        />
        {required && (
          <RequiredMark className="text-red-500 absolute top-2.5 right-3 pointer-events-none z-10 text-sm" />
        )}
      </div>
      <InputErrorList errorFocus={Boolean(isError)} errors={isError ? [meta.error as string] : []} />
    </div>
  );
}
