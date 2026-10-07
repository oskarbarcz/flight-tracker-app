import React from "react";
import type { IconType } from "react-icons";
import { Link } from "react-router";
import { BottomNavClouds } from "~/shared/ui/BottomNav/BottomNavClouds";

type Props = {
  label: string;
  icon: IconType;
  to: string | null;
  isActive: boolean;
};

const LABEL = "text-2xs font-medium leading-none";

const SHAPE =
  "bottom-nav-pill flex flex-col items-center justify-end gap-1.5 overflow-hidden rounded-2xl [-webkit-tap-highlight-color:transparent]";

export function BottomNavRaisedTab({ label, icon: Icon, to, isActive }: Props) {
  if (to === null) {
    return (
      <span
        aria-disabled
        className={`${SHAPE} select-none bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400`}
      >
        <Icon size={21} strokeWidth={2.25} aria-hidden />
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
      className={`${SHAPE} text-white outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        isActive ? "bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"
      }`}
    >
      <BottomNavClouds />
      <span className="nav-plane-flight relative z-10 flex items-center justify-center">
        <Icon size={21} strokeWidth={2.25} aria-hidden />
      </span>
      <span className={`${LABEL} relative z-10`}>{label}</span>
    </Link>
  );
}
