"use client";

import { Label, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import InputErrorList from "~/components/shared/Form/InputErrorList";

type InputProps = {
  htmlName: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  value?: string;
  errors?: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export default function InputBlock({
  htmlName,
  label,
  required,
  defaultValue,
  value,
  errors = [],
  onChange,
  onBlur,
}: InputProps) {
  const [isMarkedRed, setIsMarkedRed] = useState<boolean>(false);

  useEffect(() => {
    setIsMarkedRed(errors.length > 0);
  }, [errors]);

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={htmlName} color={isMarkedRed ? "failure" : undefined}>
          {label}
        </Label>
      </div>
      <TextInput
        id={htmlName}
        name={htmlName}
        defaultValue={defaultValue}
        value={value}
        required={required}
        onChange={(e) => {
          setIsMarkedRed(false);
          onChange?.(e);
        }}
        onBlur={onBlur}
        color={isMarkedRed ? "failure" : undefined}
      />
      <InputErrorList errorFocus={isMarkedRed} errors={errors} />
    </div>
  );
}
