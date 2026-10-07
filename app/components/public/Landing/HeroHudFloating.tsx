import React from "react";
import { AltitudeHudCard } from "./AltitudeHudCard";
import { SpeedHudCard } from "./SpeedHudCard";
import { WeightHudCard } from "./WeightHudCard";

export function HeroHudFloating() {
  return (
    <>
      <div className="hidden xl:flex absolute -left-4 top-1/4 flex-col gap-5 animate-in fade-in duration-300 ease-out motion-safe:slide-in-from-left-4 z-10 w-64 pointer-events-none">
        <SpeedHudCard />
        <AltitudeHudCard />
      </div>
      <div className="hidden xl:flex absolute -right-4 top-1/3 flex-col gap-5 animate-in fade-in duration-300 ease-out motion-safe:slide-in-from-right-4 z-10 w-64 pointer-events-none">
        <WeightHudCard />
      </div>
    </>
  );
}
