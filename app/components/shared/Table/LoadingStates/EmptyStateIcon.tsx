"use client";

import React, { JSX } from "react";
import type { IconType } from "react-icons";

type Props = {
  icon: IconType;
  color: "blue";
};

export function EmptyStateIcon({ icon: Icon, color }: Props): JSX.Element {
  const colors = {
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-950",
  }[color];

  return (
    <div
      className={`${colors} flex mb-6 items-center justify-center size-12 md:size-14 lg:size-16 mx-auto rounded-xl`}
    >
      <Icon className="size-6 md:size-7 lg:size-8" />
    </div>
  );
}
