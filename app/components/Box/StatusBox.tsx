"use client";

import React from "react";

type StatusBoxProps = {
  children: React.ReactNode;
};

export default function StatusBox({ children }: StatusBoxProps) {
  return (
    <div className="col-span-1 rounded-md bg-indigo-500 p-4 text-white shadow-md md:col-span-3">
      {children}
    </div>
  );
}
