"use client";

import { Label, Select } from "flowbite-react";
import React from "react";
import { useField } from "formik";

type SelectOption = {
  value: string;
  label: string;
};

type SelectBlockProps = {
  field: string;
  label: string;
  required?: boolean;
  options: SelectOption[];
  disabled?: boolean;
};

export default function ManagedSelectBlock({
  field,
  label,
  required = true,
  options = [],
  disabled = false,
}: SelectBlockProps) {
  const [fieldProps] = useField(field);

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={field}>{label}</Label>
      </div>
      <Select
        id={field}
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
    </div>
  );
}
