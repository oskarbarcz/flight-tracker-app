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
  disabled?: boolean;
  stretch?: boolean;
};

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  disabledValues = [],
  disabled = false,
  stretch = false,
}: Props<T>) {
  return (
    <fieldset
      aria-label={ariaLabel}
      className={twMerge(
        "inline-flex min-w-0 items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800",
        stretch && "flex w-full",
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        const unavailable = disabled || (!active && disabledValues.includes(option.value));
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={ariaLabel ? `${ariaLabel}: ${option.label}` : undefined}
            disabled={unavailable}
            onClick={() => onChange(option.value)}
            className={twMerge(
              "whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 pointer-coarse:min-h-11 pointer-coarse:px-3 dark:focus-visible:ring-indigo-400",
              stretch && "flex-auto px-1.5 pointer-coarse:px-1.5",
              active
                ? "bg-white text-gray-900 ring-1 ring-gray-200 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
              unavailable && "cursor-not-allowed opacity-50 hover:text-gray-500 dark:hover:text-gray-400",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </fieldset>
  );
}
