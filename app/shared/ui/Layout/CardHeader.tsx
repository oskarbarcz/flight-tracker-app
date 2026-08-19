import React, { useContext } from "react";
import { twMerge } from "tailwind-merge";
import { type ContainerPadding, ContainerPaddingContext } from "~/shared/ui/Layout/Container";

const INSET: Record<ContainerPadding, string> = {
  none: "px-3",
  condensed: "px-3",
  normal: "px-3.5",
  spacious: "px-4",
};

type Props = {
  title: string;
  actions?: React.ReactNode;
};

export function CardHeader({ title, actions }: Props) {
  const padding = useContext(ContainerPaddingContext);

  return (
    <header
      className={twMerge(
        "flex min-h-8 shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-gray-200 bg-gray-50 py-1 dark:border-gray-700 dark:bg-gray-800",
        INSET[padding],
      )}
    >
      <h2 className="min-w-0 truncate text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {title}
      </h2>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}
