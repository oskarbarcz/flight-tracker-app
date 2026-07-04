import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import type { Terminal } from "~/features/terminal";

type Props = {
  terminal: Terminal | null;
  children: React.ReactNode;
};

export function CollapsibleTerminalSection({ terminal, children }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className="space-y-2">
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-expanded={!collapsed}
        className="flex w-full items-baseline gap-2 px-1 text-left cursor-pointer"
      >
        <HiChevronDown
          className={twMerge(
            "size-4 shrink-0 self-center text-gray-400 transition-transform",
            collapsed && "-rotate-90",
          )}
        />
        <h3 className="font-mono font-bold text-gray-900 dark:text-white">{terminal?.shortName ?? "Unassigned"}</h3>
        {terminal ? <span className="text-sm text-gray-500">{terminal.fullName}</span> : null}
      </button>
      {collapsed ? null : <div className="space-y-2">{children}</div>}
    </section>
  );
}
