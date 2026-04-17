import React from "react";
import { DeepDiveCard } from "./DeepDiveCard";
import { SectionHeader } from "./SectionHeader";

const operatorFeatures = [
  {
    title: "Complete Flight Management.",
    description:
      "From initial scheduling to pinpoint precision on the loadsheet. Master every parameter before the engines even start.",
    imageUrl: "https://placehold.co/1200x600/e2e8f0/475569?text=Flight+Management+Dashboard",
    imageAlt: "Flight Management View",
    aspectRatioClass: "pt-[60%] md:pt-[50%]",
  },
  {
    title: "Live Fleet Management.",
    description:
      "See exactly where every aircraft is parked or flying. Track real-time fleet age and effortlessly manage complex daily crew rotations—all from a single, unified view.",
    imageUrl: "https://placehold.co/800x600/e2e8f0/475569?text=Live+Fleet+Tracker",
    imageAlt: "Fleet Tracker Map",
  },
  {
    title: "Airports Intelligently Mapped.",
    description:
      "Understand exactly where your airline zones reside. Locate active parking areas, define Schengen constraints, and coordinate massive ground operations visually.",
    imageUrl: "https://placehold.co/800x600/e2e8f0/475569?text=Airports+Ground+Map",
    imageAlt: "Airport Management Chart",
  },
];

export function OperatorDeepDiveSection() {
  return (
    <section className="bg-transparent font-sans relative pt-24 pb-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 relative items-start">
          {/* Left Sticky Column */}
          <div className="w-full md:w-1/3 md:sticky md:top-32 h-auto mb-12 md:mb-0">
            <SectionHeader
              eyebrow="Operator Toolkit"
              title="Everything you need."
              subtitle="All in one place."
              description="Control airline operations from a macroscopic view before the flights even push back."
              centered={false}
            />
          </div>

          {/* Right Scrolling Column */}
          <div className="w-full md:w-2/3 flex flex-col gap-32 md:gap-48 pb-16">
            {operatorFeatures.map((feature) => (
              <DeepDiveCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
