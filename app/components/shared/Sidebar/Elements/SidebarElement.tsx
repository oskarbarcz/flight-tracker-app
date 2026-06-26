import React from "react";
import type { IconType } from "react-icons";
import { Link } from "react-router";

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
      {showBadge && (
        <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">
          {badge}
        </span>
      )}
    </>
  );

  if (isSelected) {
    return (
      <Link
        to={href}
        className="text-indigo-500 bg-indigo-100 dark:bg-gray-800 dark:text-white hover:bg-indigo-200 dark:hover:bg-gray-700 active:bg-indigo-300 dark:active:bg-gray-700 active:scale-[0.97] items-center cursor-pointer flex gap-3 py-2 px-3 rounded-xl text-sm ease-in-out transition duration-75"
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
      className="text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-800 dark:hover:text-white active:bg-indigo-100 dark:active:bg-gray-700 active:scale-[0.97] items-center cursor-pointer flex gap-3 py-2 px-3 rounded-xl text-sm ease-in-out transition duration-75"
      replace
      viewTransition
    >
      {content}
    </Link>
  );
}
