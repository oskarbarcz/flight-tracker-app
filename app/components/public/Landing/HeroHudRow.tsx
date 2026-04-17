import React from "react";
import { AltitudeHudCard } from "./AltitudeHudCard";
import { SpeedHudCard } from "./SpeedHudCard";
import { WeightHudCard } from "./WeightHudCard";

export function HeroHudRow() {
  return (
    <div className="hidden md:flex xl:hidden flex-row gap-4 w-full max-w-2xl pointer-events-none">
      <SpeedHudCard compact />
      <AltitudeHudCard compact />
      <WeightHudCard compact />
    </div>
  );
}
