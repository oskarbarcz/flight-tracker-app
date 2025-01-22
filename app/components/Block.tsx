"use client";

import React from "react";

interface BlockProps {
  children: React.ReactNode;
}

export default function Block({ children }: BlockProps) {
  return (
    <section className="mt-5 rounded-lg bg-gray-100 p-8 shadow dark:bg-gray-800">
      {children}
    </section>
  );
}
