import React from "react";
import { AltitudeHudCard } from "./AltitudeHudCard";
import { SpeedHudCard } from "./SpeedHudCard";
import { WeightHudCard } from "./WeightHudCard";

export function HeroHudFloating() {
  return (
    <>
      <div className="hidden xl:flex absolute -left-4 top-1/4 flex-col gap-5 animate-fade-in-left z-10 w-64 pointer-events-none">
        <SpeedHudCard />
        <AltitudeHudCard />
      </div>
      <div className="hidden xl:flex absolute -right-4 top-1/3 flex-col gap-5 animate-fade-in-right z-10 w-64 pointer-events-none">
        <WeightHudCard />
      </div>
    </>
  );
}
