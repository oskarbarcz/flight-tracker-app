import React from "react";
import { Outlet } from "react-router";
import { AnimatedBlobs } from "~/shared/ui/Blob/AnimatedBlobs";
import { Footer } from "~/shared/ui/Layout/Footer";

export default function AuthLayout() {
  return (
    <div className="relative h-full">
      <AnimatedBlobs />

      <div className="relative z-10 h-full">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
