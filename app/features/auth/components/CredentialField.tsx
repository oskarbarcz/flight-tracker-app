import { TextInput } from "flowbite-react";
import type React from "react";

type CredentialFieldProps = {
  id: string;
  label: string;
  type: "email" | "password";
  autoComplete: string;
  value: string;
  readOnly?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  onChange: (value: string) => void;
};

export function CredentialField({
  id,
  label,
  type,
  autoComplete,
  value,
  readOnly,
  inputRef,
  onChange,
}: CredentialFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-bold uppercase tracking-[0.08em] text-gray-600 dark:text-gray-400"
      >
        {label}
      </label>
      <TextInput
        ref={inputRef}
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required
        readOnly={readOnly}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
