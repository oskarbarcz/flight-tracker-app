import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import type { Terminal } from "~/features/terminal";

type Props = {
  terminal: Terminal | null;
  countLabel?: string;
  defaultCollapsed?: boolean;
  children: React.ReactNode;
};

export function CollapsibleTerminalSection({ terminal, countLabel, defaultCollapsed = false, children }: Props) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <section className="space-y-2">
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-expanded={!collapsed}
        className="flex w-full cursor-pointer items-baseline gap-2 px-1 text-left"
      >
        <HiChevronDown
          className={twMerge(
            "size-4 shrink-0 self-center text-gray-400 transition-transform",
            collapsed && "-rotate-90",
          )}
        />
        <h3 className="shrink-0 font-mono text-base font-bold text-gray-900 dark:text-white">
          {terminal?.shortName ?? "Unassigned"}
        </h3>
        {terminal ? (
          <>
            <span className="h-4 w-px shrink-0 self-center bg-gray-300 dark:bg-gray-700" />
            <span className="truncate text-sm text-gray-500">{terminal.fullName}</span>
          </>
        ) : null}
        {countLabel ? <span className="ms-auto shrink-0 text-sm text-gray-500">{countLabel}</span> : null}
      </button>
      {collapsed ? null : <div className="space-y-2">{children}</div>}
    </section>
  );
}
