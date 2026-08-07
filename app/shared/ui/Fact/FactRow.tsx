import React from "react";

type Props = {
  label: string;
  children: React.ReactNode;
};

export function FactRow({ label, children }: Props) {
  return (
    <div className="flex gap-3 px-3 py-1.5">
      <dt className="w-20 shrink-0 pt-0.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-sm text-gray-800 dark:text-gray-200">{children}</dd>
    </div>
  );
}
