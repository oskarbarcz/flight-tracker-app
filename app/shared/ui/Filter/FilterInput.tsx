import { TextInput } from "flowbite-react";
import React from "react";
import { LuSearch } from "react-icons/lu";

const filterInputTheme = {
  field: {
    icon: {
      base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
      svg: "h-4 w-4 text-gray-400 dark:text-gray-500",
    },
    input: {
      withIcon: {
        on: "pl-9",
      },
    },
  },
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength?: number;
  className?: string;
};

export function FilterInput({ value, onChange, placeholder, maxLength, className }: Props) {
  return (
    <TextInput
      theme={filterInputTheme}
      icon={LuSearch}
      sizing="sm"
      className={className}
      maxLength={maxLength}
      aria-label={placeholder}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
