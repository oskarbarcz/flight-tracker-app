import React from "react";

type Props = {
  children: React.ReactNode;
};

export function FormSectionLabel({ children }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {children}
      </span>
      <span aria-hidden={true} className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
