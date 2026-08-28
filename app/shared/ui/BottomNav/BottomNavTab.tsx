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

const LABEL = "text-[11px] font-medium leading-none";
const SLOT = "flex flex-1 flex-col items-center justify-center gap-1.5 py-2";

export function BottomNavTab({ label, icon: Icon, to, isActive, badge }: Props) {
  const showBadge = typeof badge === "number" && badge > 0;
  const tone = isActive ? "text-indigo-600 dark:text-indigo-300" : "text-gray-500 dark:text-gray-400";

  if (to === null) {
    return (
      <span aria-disabled className={`${SLOT} select-none text-gray-300 dark:text-gray-600`}>
        <span className="flex h-6 w-12 items-center justify-center">
          <Icon size={21} aria-hidden />
        </span>
        <span className={LABEL}>{label}</span>
      </span>
    );
  }

  return (
    <Link
      to={to}
      replace
      viewTransition
      aria-current={isActive ? "page" : undefined}
      className={`${SLOT} outline-none focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-400`}
    >
      <span className={`relative flex h-6 w-12 items-center justify-center transition-colors duration-200 ${tone}`}>
        <Icon size={21} aria-hidden />
        {showBadge && (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold leading-none text-white">
            {badge}
          </span>
        )}
      </span>
      <span className={`${LABEL} transition-colors duration-200 ${tone}`}>{label}</span>
    </Link>
  );
}
