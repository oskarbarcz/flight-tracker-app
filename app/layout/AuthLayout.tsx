"use client";

import React from "react";
import { Outlet } from "react-router";
import Footer from "~/components/Layout/Footer";
import { AnimatedBlobs } from "~/components/Blob/AnimatedBlobs";

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
