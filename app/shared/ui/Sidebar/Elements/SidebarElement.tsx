import React from "react";
import type { IconType } from "react-icons";
import { Link } from "react-router";
import { CountBadge } from "~/shared/ui/Display/CountBadge";

type Props = {
  isSelected: boolean;
  label: string;
  href: string;
  icon: IconType;
  badge?: number;
};

export function SidebarElement({ isSelected, label, href, icon: Icon, badge }: Props) {
  const showBadge = typeof badge === "number" && badge > 0;
  const content = (
    <>
      <Icon size={18} />
      <span>{label}</span>
      {showBadge && <CountBadge count={badge} className="ms-auto" />}
    </>
  );

  if (isSelected) {
    return (
      <Link
        to={href}
        aria-current="page"
        className="font-semibold text-indigo-600 bg-indigo-100 dark:bg-gray-800 dark:text-white hover:bg-indigo-200 dark:hover:bg-gray-700 active:bg-indigo-300 dark:active:bg-gray-700 active:scale-[0.96] items-center cursor-pointer flex gap-3 py-2 px-3 rounded-xl text-sm transition-[color,background-color,scale] duration-150 ease-out"
        replace
        viewTransition
      >
        {content}
      </Link>
    );
  }

  return (
    <Link
      to={href}
      className="text-gray-500 dark:text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-800 dark:hover:text-white active:bg-indigo-100 dark:active:bg-gray-700 active:scale-[0.96] items-center cursor-pointer flex gap-3 py-2 px-3 rounded-xl text-sm transition-[color,background-color,scale] duration-150 ease-out"
      replace
      viewTransition
    >
      {content}
    </Link>
  );
}
