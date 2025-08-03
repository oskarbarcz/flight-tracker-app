"use client";

import React from "react";

type ContainerTitleProps = {
  children: React.ReactNode;
};

export default function ContainerTitle({ children }: ContainerTitleProps) {
  return (
    <h2 className="text-lg pb-4 font-bold dark:text-gray-300 leading-5">
      {children}
    </h2>
  );
}
