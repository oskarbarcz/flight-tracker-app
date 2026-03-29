import { Button } from "flowbite-react";
import React from "react";
import { Link } from "react-router";
import { HeroBackground } from "./HeroBackground";
import { HeroHudFloating, HeroHudRow } from "./HeroHudTiles";

export function LandingHero() {
  return (
    // section is the relative positioning root for the floating panels
    <section className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-500">

      {/* Background images + four-sided gradient vignettes */}
      <HeroBackground />

      {/* Floating HUD panels — direct children of section so absolute positioning
          spans the full section width, not the constrained content column */}
      <HeroHudFloating />

      {/* Main content column — constrained to max-w-5xl */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8 pb-6 md:pt-6 flex flex-col items-center gap-10">

        {/* Typography & CTAs */}
        <div className="text-center transition-colors duration-500">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/60 dark:bg-indigo-500/20 border border-gray-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-widest uppercase mb-8 md:mb-0 shadow-sm dark:shadow-xl backdrop-blur-xl">
            The Ultimate Simulator Ecosystem
          </span>

          <h1 className="text-5xl mt-8 font-extrabold tracking-tighter text-gray-900 dark:text-white sm:text-7xl lg:text-[5.5rem] leading-[1.05] drop-shadow-xl sm:drop-shadow-2xl">
            Precision Dispatch.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-300 dark:via-indigo-400 dark:to-purple-400">
              Seamless Execution.
            </span>
          </h1>

          <p className="mt-8 text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium drop-shadow-sm dark:drop-shadow-xl">
            From complex fleet rotation and continuous loadsheet calculations to live airborne telemetry.
            Master the flight levels natively from cold-and-dark setup to engines off.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button as={Link} to="/sign-in" color="indigo" size="xl" className="w-full sm:w-auto">
              Access Flight Deck
            </Button>
            <Button as={Link} to="/sign-in" color="light" size="xl" className="w-full sm:w-auto">
              Initiate Dispatch
            </Button>
          </div>
        </div>

        {/* Compact HUD row — in-flow, appears below text on md→2xl */}
        <HeroHudRow />

      </div>
    </section>
  );
}
