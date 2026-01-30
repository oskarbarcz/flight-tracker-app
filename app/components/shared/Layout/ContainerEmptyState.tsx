"use client";

import React from "react";
import { FaCircleInfo } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
};

export default function ContainerEmptyState({ children }: Props) {
  return (
    <div className="mt-3 flex items-center justify-center p-8 text-center text-gray-500 bg-gray-50 dark:bg-gray-950 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
      {children}
    </div>
  );
}
