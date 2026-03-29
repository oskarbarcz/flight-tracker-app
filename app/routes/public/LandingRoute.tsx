"use client";

import React from "react";
import { Navigate } from "react-router";
import { LandingFooter } from "~/components/public/Landing/LandingFooter";
import { LandingHero } from "~/components/public/Landing/LandingHero";
import { HowItWorksSection } from "~/components/public/Landing/HowItWorksSection";
import { LandingNavbar } from "~/components/public/Landing/LandingNavbar";
import { OperatorDeepDiveSection } from "~/components/public/Landing/OperatorDeepDiveSection";
import { PilotDeepDiveSection } from "~/components/public/Landing/PilotDeepDiveSection";
import { StorytellingSection } from "~/components/public/Landing/StorytellingSection";
import { useAuth } from "~/state/api/context/useAuth";

export default function LandingRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Avoid flicker
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 font-sans relative">
      <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[60%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>
      <LandingNavbar />
      <LandingHero />
      <HowItWorksSection />
      <OperatorDeepDiveSection />
      <PilotDeepDiveSection />
      <LandingFooter />
    </main>
  );
}
