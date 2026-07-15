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
};

export function SegmentedControl<T extends string>({ value, onChange, options, ariaLabel }: Props<T>) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-xl border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-800">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={ariaLabel ? `${ariaLabel}: ${option.label}` : undefined}
            onClick={() => onChange(option.value)}
            className={twMerge(
              "cursor-pointer rounded-lg px-2 py-0.5 text-xs font-semibold transition-colors",
              active
                ? "bg-indigo-500 text-white"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
