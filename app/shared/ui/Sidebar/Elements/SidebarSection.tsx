import React from "react";

type Props = {
  label?: string;
  children: React.ReactNode;
};

export function SidebarSection({ label, children }: Props) {
  return (
    <div className="flex flex-col gap-y-1">
      {label && (
        <span className="px-3 pb-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</span>
      )}
      {children}
    </div>
  );
}
