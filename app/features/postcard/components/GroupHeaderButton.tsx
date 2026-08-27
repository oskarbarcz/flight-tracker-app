import { Badge } from "flowbite-react";
import React from "react";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

type Props = {
  open: boolean;
  onToggle: () => void;
  label: React.ReactNode;
  count: number;
  failedCount: number;
  className?: string;
};

export function GroupHeaderButton({ open, onToggle, label, count, failedCount, className }: Props) {
  const Chevron = open ? LuChevronDown : LuChevronRight;

  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className={twMerge(
        "flex w-full cursor-pointer items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-300 dark:hover:bg-gray-800/60",
        className,
      )}
    >
      <Chevron className="size-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden={true} />
      {label}
      {failedCount > 0 && (
        <Badge size="xs" color="failure">
          {failedCount} failed
        </Badge>
      )}
      <span className="shrink-0 font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">{count}</span>
    </button>
  );
}
