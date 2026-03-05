"use client";

import React from "react";
import { Outlet } from "react-router";
import { AnimatedBlobs } from "~/components/shared/Blob/AnimatedBlobs";
import Footer from "~/components/shared/Layout/Footer";

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
