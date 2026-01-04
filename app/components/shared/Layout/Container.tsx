"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

export type ContainerClassProps = {
  className?: string;
};

type Padding = "none" | "condensed" | "normal" | "spacious";

function spacingToPadding(spacing: Padding): string {
  const options = {
    none: "p-0",
    condensed: "p-5",
    normal: "p-6",
    spacious: "p-7",
  };
  return options[spacing];
}

type ContainerProps = ContainerClassProps & {
  children?: React.ReactNode;
  invisible?: boolean;
  padding?: Padding;
};

export default function Container({
  children,
  className,
  invisible = false,
  padding = "normal",
}: ContainerProps) {
  const border =
    "rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-300";
  let finalClassList = twMerge(className, spacingToPadding(padding));

  if (!invisible) {
    finalClassList = twMerge(border, finalClassList);
  }

  return <section className={finalClassList}>{children}</section>;
}
