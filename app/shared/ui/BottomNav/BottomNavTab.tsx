import React from "react";
import type { IconType } from "react-icons";
import { Link } from "react-router";

type Props = {
  label: string;
  icon: IconType;
  to: string | null;
  isActive: boolean;
  badge?: number;
};

export function BottomNavTab({ label, icon: Icon, to, isActive, badge }: Props) {
  const showBadge = typeof badge === "number" && badge > 0;

  const iconTone = isActive ? "text-indigo-500 dark:text-white" : "text-gray-500 dark:text-gray-400";
  const pillTone = isActive ? "bg-indigo-100 dark:bg-gray-800" : "bg-transparent";
  const labelTone = isActive ? "text-indigo-500 dark:text-white" : "text-gray-500 dark:text-gray-400";

  const content = (
    <>
      <span
        className={`relative flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-150 ${pillTone}`}
      >
        <Icon size={20} className={iconTone} aria-hidden />
        {showBadge && (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold leading-none text-white">
            {badge}
          </span>
        )}
      </span>
      <span className={`text-[11px] font-medium leading-none ${labelTone}`}>{label}</span>
    </>
  );

  if (to === null) {
    return (
      <span
        aria-disabled
        className="flex flex-1 select-none flex-col items-center justify-center gap-1 py-2 text-gray-300 dark:text-gray-600"
      >
        <span className="flex h-7 w-12 items-center justify-center">
          <Icon size={20} aria-hidden />
        </span>
        <span className="text-[11px] font-medium leading-none">{label}</span>
      </span>
    );
  }

  return (
    <Link
      to={to}
      replace
      viewTransition
      aria-current={isActive ? "page" : undefined}
      className="flex flex-1 flex-col items-center justify-center gap-1 py-2 outline-none transition-transform duration-100 focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-400 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      {content}
    </Link>
  );
}
