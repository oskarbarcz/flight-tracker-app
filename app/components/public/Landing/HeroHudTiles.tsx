import React from "react";
import { AltitudeHudCard, SpeedHudCard, WeightHudCard } from "./HeroHudCards";

/**
 * Compact in-flow row — sits below the hero text on md→2xl.
 * Must be placed INSIDE the content wrapper (not the section).
 */
export function HeroHudRow() {
  return (
    <div className="hidden md:flex xl:hidden flex-row gap-4 w-full max-w-2xl pointer-events-none">
      <SpeedHudCard compact />
      <AltitudeHudCard compact />
      <WeightHudCard compact />
    </div>
  );
}

/**
 * Full-size floating panels — absolutely positioned left & right.
 * Must be placed as a DIRECT CHILD of the <section> (relative container)
 * so the absolute positioning spans the full viewport width.
 */
export function HeroHudFloating() {
  return (
    <>
      {/* Floating left panel (2xl+) */}
      <div className="hidden xl:flex absolute left-12 top-1/4 flex-col gap-6 animate-fade-in-left z-10 w-72 pointer-events-none">
        <SpeedHudCard />
        <div className="transform -translate-x-6">
          <AltitudeHudCard />
        </div>
      </div>

      {/* Floating right panel (2xl+) */}
      <div className="hidden xl:flex absolute right-12 top-1/3 flex-col gap-6 animate-fade-in-right z-10 w-72 pointer-events-none">
        <div className="transform translate-x-4">
          <WeightHudCard />
        </div>
      </div>
    </>
  );
}
