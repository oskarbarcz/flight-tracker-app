import { Select } from "flowbite-react";
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

const labelBase =
  "absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white text-sm dark:bg-gray-800 whitespace-nowrap";

export function ManagedFloatingSelectBlock({
  className,
  field,
  label,
  required = true,
  options = [],
  disabled = false,
}: Props) {
  const [fieldProps, meta, helpers] = useField(field);
  const isError = Boolean(meta.touched && meta.error);
  const density = useFormDensity();

  useEffect(() => {
    const isSelectable = options.some((option) => option.value === fieldProps.value);
    if (!isSelectable && options.length > 0) {
      helpers.setValue(options[0].value);
    }
  }, [options, fieldProps.value, helpers]);

  return (
    <div className={twMerge("w-full", className)}>
      <div className="relative">
        <Select
          id={field}
          sizing={density.floatingSizing === "sm" ? "floatingSm" : "floating"}
          color={isError ? "floatingError" : "floating"}
          required={required}
          disabled={disabled}
          {...fieldProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <label
          htmlFor={field}
          className={twMerge(
            labelBase,
            density.floatingSizing === "sm" ? "px-1" : "px-2",
            isError ? "text-red-600 dark:text-red-500" : "text-gray-500 dark:text-gray-400",
          )}
        >
          {label}
          {required && <RequiredMark />}
        </label>
      </div>
      <InputErrorList
        errorFocus={isError}
        errors={isError ? [meta.error as string] : []}
        size={density.floatingSizing}
      />
    </div>
  );
}
