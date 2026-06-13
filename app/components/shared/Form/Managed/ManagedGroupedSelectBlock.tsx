"use client";

import { Label, Select } from "flowbite-react";
import { useField } from "formik";
import React from "react";
import { twMerge } from "tailwind-merge";
import { InputErrorList } from "~/components/shared/Form/InputErrorList";
import { RequiredMark } from "~/components/shared/Form/RequiredMark";

type GroupedOption = { value: string; label: string };

type OptionGroup = { label: string; options: GroupedOption[] };

type Props = {
  className?: string;
  field: string;
  label: string;
  required?: boolean;
  groups: OptionGroup[];
  disabled?: boolean;
};

export function ManagedGroupedSelectBlock({
  className,
  field,
  label,
  required = true,
  groups,
  disabled = false,
}: Props) {
  const [fieldProps, meta] = useField(field);
  const isError = meta.touched && meta.error;

  return (
    <div className={twMerge("w-full mb-4", className)}>
      <div className="mb-2 block">
        <Label htmlFor={field} color={isError ? "failure" : undefined}>
          {label}
          {required && <RequiredMark />}
        </Label>
      </div>
      <Select
        id={field}
        required={required}
        disabled={disabled}
        color={isError ? "failure" : undefined}
        {...fieldProps}
      >
        {groups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>
      <InputErrorList errorFocus={Boolean(isError)} errors={isError ? [meta.error as string] : []} />
    </div>
  );
}
