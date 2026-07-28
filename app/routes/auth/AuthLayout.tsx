import React from "react";
import { Outlet } from "react-router";
import { Footer } from "~/shared/ui/Layout/Footer";

export default function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-gray-100 dark:bg-gray-950">
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
