import React from "react";
import { Navigate } from "react-router";
import { HowItWorksSection } from "~/components/public/Landing/HowItWorksSection";
import { LandingFooter } from "~/components/public/Landing/LandingFooter";
import { LandingHero } from "~/components/public/Landing/LandingHero";
import { LandingNavbar } from "~/components/public/Landing/LandingNavbar";
import { OperatorDeepDiveSection } from "~/components/public/Landing/OperatorDeepDiveSection";
import { PilotDeepDiveSection } from "~/components/public/Landing/PilotDeepDiveSection";
import { useInstalledApp } from "~/shared/hooks/useInstalledApp";

export default function LandingRoute() {
  const isInstalledApp = useInstalledApp();

  if (isInstalledApp) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <main className="min-h-dvh bg-white dark:bg-gray-950 font-sans relative">
      <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-150 h-150 text-indigo-500/10 bg-[radial-gradient(circle,currentColor,transparent_70%)]"></div>
        <div className="absolute top-[60%] right-[-10%] w-150 h-150 text-purple-500/10 bg-[radial-gradient(circle,currentColor,transparent_70%)]"></div>
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
