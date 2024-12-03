'use client'

import React from "react";

interface BlockProps {
  children: React.ReactNode;
}

export default function Block ({children}: BlockProps) {
  return <section className="shadow rounded-lg bg-white dark:bg-gray-800 mt-5 p-8">
    {children}
  </section>;
}