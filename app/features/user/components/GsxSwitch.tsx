import { ToggleSwitch } from "flowbite-react";

type Props = {
  label: string;
  describedBy?: string;
  checked: boolean | null;
  disabled?: boolean;
  sizing: "sm" | "md";
  onChange: (enabled: boolean) => void;
};

const SKELETON_SIZE = {
  sm: "h-5 w-9",
  md: "h-6 w-11",
} as const;

export function GsxSwitch({ label, describedBy, checked, disabled = false, sizing, onChange }: Props) {
  if (checked === null) {
    return (
      <span
        aria-hidden={true}
        className={`block ${SKELETON_SIZE[sizing]} animate-pulse rounded-full bg-gray-200 motion-reduce:animate-none dark:bg-gray-800`}
      />
    );
  }

  return (
    <ToggleSwitch
      checked={checked}
      color="indigo"
      sizing={sizing}
      disabled={disabled}
      aria-label={label}
      aria-describedby={describedBy}
      className="pointer-coarse:min-h-11 pointer-coarse:min-w-11 pointer-coarse:justify-center"
      onChange={onChange}
    />
  );
}
