import { twMerge } from "tailwind-merge";

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  ariaLabel?: string;
  disabledValues?: T[];
};

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  disabledValues = [],
}: Props<T>) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-xl border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-800">
      {options.map((option) => {
        const active = option.value === value;
        const disabled = !active && disabledValues.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={ariaLabel ? `${ariaLabel}: ${option.label}` : undefined}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={twMerge(
              "rounded-lg px-2 py-0.5 text-xs font-semibold transition-colors pointer-coarse:min-h-11 pointer-coarse:px-3",
              active
                ? "bg-indigo-500 text-white"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100",
              disabled &&
                "cursor-not-allowed text-gray-300 hover:text-gray-300 dark:text-gray-600 dark:hover:text-gray-600",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
