import React, { useState } from "react";
import type { IconType } from "react-icons";
import { Link } from "react-router";
import { BottomNavClouds } from "~/shared/ui/BottomNav/BottomNavClouds";

type Props = {
  label: string;
  icon: IconType;
  to: string | null;
  isActive: boolean;
};

const LABEL = "text-[11px] font-semibold leading-none";

const SHAPE =
  "absolute -top-5 bottom-0 left-1/2 flex w-[70px] -translate-x-1/2 flex-col items-center justify-end gap-1 overflow-hidden rounded-t-2xl pb-2";

export function BottomNavRaisedTab({ label, icon: Icon, to, isActive }: Props) {
  const [skyKey, setSkyKey] = useState(0);

  if (to === null) {
    return (
      <span
        aria-disabled
        className={`${SHAPE} select-none bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600`}
      >
        <Icon size={24} aria-hidden />
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
      onClick={() => setSkyKey((key) => key + 1)}
      className={`${SHAPE} text-white shadow-lg shadow-indigo-600/25 outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-300 ${
        isActive ? "bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"
      }`}
    >
      <span key={skyKey}>
        <BottomNavClouds />
      </span>
      <span className="nav-plane-flight relative z-10 flex items-center justify-center">
        <Icon size={24} aria-hidden />
      </span>
      <span className={`${LABEL} relative z-10`}>{label}</span>
    </Link>
  );
}
