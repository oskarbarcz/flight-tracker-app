import React from "react";

type Props = {
  label: string;
};

export function SidebarAirportGroupLabel({ label }: Props) {
  return (
    <div className="flex items-center gap-2 px-3 pt-0.5">
      <span className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-600" aria-hidden />
      <span className="text-[10px] font-semibold uppercase leading-none tracking-widest text-gray-400">{label}</span>
      <span className="flex-1 border-t border-dashed border-gray-300 dark:border-gray-600" aria-hidden />
    </div>
  );
}
