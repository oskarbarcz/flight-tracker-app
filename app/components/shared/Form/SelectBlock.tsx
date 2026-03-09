"use client";

import { Label, Select } from "flowbite-react";
import React from "react";

type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  htmlName: string;
  label: string;
  required?: boolean;
  options: SelectOption[];
  defaultValue?: string;
};

export function SelectBlock({ htmlName, label, required, options, defaultValue }: Props) {
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={htmlName}>{label}</Label>
      </div>
      <Select id={htmlName} name={htmlName} defaultValue={defaultValue} required={required}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
