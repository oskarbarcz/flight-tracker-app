import React from "react";

export type LoadsheetVariant = "preliminary" | "final";

type Props = {
  value: LoadsheetVariant;
  onChange: (variant: LoadsheetVariant) => void;
  hasPreliminary: boolean;
  hasFinal: boolean;
};

export function VariantSwitch({ value, onChange, hasPreliminary, hasFinal }: Props) {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800">
      <SwitchButton
        label="Preliminary"
        active={value === "preliminary"}
        disabled={!hasPreliminary}
        onClick={() => onChange("preliminary")}
      />
      <SwitchButton label="Final" active={value === "final"} disabled={!hasFinal} onClick={() => onChange("final")} />
    </div>
  );
}

function SwitchButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest transition ${
        active
          ? "bg-white text-indigo-600 shadow-sm dark:bg-gray-900 dark:text-indigo-300"
          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      } disabled:cursor-not-allowed disabled:text-gray-300 dark:disabled:text-gray-600`}
    >
      {label}
    </button>
  );
}
