"use client";

import React from "react";

type ContainerProps = {
  children?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  invisible?: boolean;
};

export default function Container({
  children,
  className,
  noPadding = false,
  invisible = false,
}: ContainerProps) {
  const base =
    "border shadow-lg rounded-4xl bg-white dark:bg-gray-800 border-indigo-100 dark:border-gray-700 text-gray-800 dark:text-gray-300 shadow-indigo-200 dark:shadow-gray-900";
  const padding = noPadding ? " " : " p-6 ";
  let finalClassList = className + padding;

  if (!invisible) {
    finalClassList += base;
  }

  return <section className={finalClassList}>{children}</section>;
}
