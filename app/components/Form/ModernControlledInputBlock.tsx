"use client";

import { FloatingLabel } from "flowbite-react";
import React from "react";

type ModernControlledInputProps = {
  htmlName: string;
  label: string;
  required?: boolean;
  value?: string;
  changeValue: (value: string) => void;
  validate?: (value: string | undefined) => boolean;
};

export default function ModernControlledInputBlock({
  htmlName,
  label,
  required,
  value,
  changeValue,
}: ModernControlledInputProps) {
  return (
    <div>
      <FloatingLabel
        variant="outlined"
        label={label}
        id={htmlName}
        type="text"
        className="dark:bg-gray-800"
        value={value}
        onChange={(e) => changeValue(e.target.value)}
        required={required}
      />
    </div>
  );
}
