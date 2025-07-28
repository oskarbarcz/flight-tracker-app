"use client";

import { Label, Select } from "flowbite-react";
import React from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectBlockProps = {
  htmlName: string;
  label: string;
  required?: boolean;
  options: SelectOption[];
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
};

export default function ManagedSelectBlock({
  htmlName,
  label,
  required,
  options,
  value,
  setValue,
  disabled = false,
}: SelectBlockProps) {
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={htmlName}>{label}</Label>
      </div>
      <Select
        id={htmlName}
        name={htmlName}
        value={value}
        required={required}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
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
