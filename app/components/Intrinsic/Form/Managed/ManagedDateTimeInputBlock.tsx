"use client";

import { FloatingLabel } from "flowbite-react";
import React, {
  HTMLInputAutoCompleteAttribute,
  useEffect,
  useState,
} from "react";
import InputErrorList from "~/components/Intrinsic/Form/Partial/InputErrorList";
import { useField } from "formik";

type ManagedDateTimeInputBlockProps = {
  field: string;
  label: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  required?: boolean;
  disabled?: boolean;
};

// Convert Date to DD-MM-YYYY HH:mm format in Zulu (UTC) time
const formatDateTimeLocal = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, "0");

  const day = pad(date.getUTCDate());
  const month = pad(date.getUTCMonth() + 1);
  const year = date.getUTCFullYear();
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

// Convert DD-MM-YYYY HH:mm format to Date in Zulu (UTC) time
const parseDateTime = (dateTimeString: string): Date | null => {
  try {
    const [datePart, timePart] = dateTimeString.split(" ");
    if (!datePart || !timePart) return null;

    const [day, month, year] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);

    if (
      !day ||
      !month ||
      !year ||
      hours === undefined ||
      minutes === undefined
    ) {
      return null;
    }

    // Create date using UTC values
    return new Date(Date.UTC(year, month - 1, day, hours, minutes));
  } catch {
    return null;
  }
};

export default function ManagedDateTimeInputBlock({
  field,
  label,
  autoComplete,
  required = true,
  disabled = false,
}: ManagedDateTimeInputBlockProps) {
  const [fieldProps, meta, helpers] = useField(field);
  const [inputValue, setInputValue] = useState<string>(
    fieldProps.value instanceof Date
      ? formatDateTimeLocal(fieldProps.value)
      : "",
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
      setInputValue(formatDateTimeLocal(fieldProps.value));
    }
  }, [fieldProps.value]);

  return (
    <div className="mb-4 w-full">
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
      <InputErrorList
        errorFocus={Boolean(isError)}
        errors={isError ? [meta.error as string] : []}
      />
    </div>
  );
}
