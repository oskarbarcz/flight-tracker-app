"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function ContainerTitle({ children }: Props) {
  return (
    <h2 className="pb-4 font-bold uppercase text-gray-500 leading-5">
      {children}
    </h2>
  );
}
