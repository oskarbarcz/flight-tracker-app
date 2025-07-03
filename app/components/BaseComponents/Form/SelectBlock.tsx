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
  defaultValue?: string;
};

export default function SelectBlock({
  htmlName,
  label,
  required,
  options,
  defaultValue,
}: SelectBlockProps) {
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={htmlName} value={label} />
      </div>
      <Select
        id={htmlName}
        name={htmlName}
        defaultValue={defaultValue}
        required={required}
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
