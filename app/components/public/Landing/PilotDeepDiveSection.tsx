import React from "react";
import { DeepDiveCard } from "./DeepDiveCard";
import { SectionHeader } from "./SectionHeader";

const pilotFeatures = [
  {
    title: "Professional Flight Briefings.",
    description:
      "Get loadsheets, confirm them seamlessly, and dive into the most professional briefing customized for your flight simulation purposes.",
    imageUrl: "https://placehold.co/1200x600/e2e8f0/475569?text=Pilot+EFB+Briefing",
    imageAlt: "Pilot Flight Briefing",
    aspectRatioClass: "pt-[60%] md:pt-[50%]",
  },
  {
    title: "Know your crew. Know your passengers.",
    description:
      "Connect deeply with your simulation ecosystem. Review the generated manifests, track boarding natively, and coordinate exactly who is riding along with you.",
    imageUrl: "https://placehold.co/800x600/e2e8f0/475569?text=Passenger+%26+Crew+Manifest",
    imageAlt: "Crew and Passenger Tracking",
  },
  {
    title: "Watch it unfold live.",
    description:
      "Know your departure airport intimately, review your exact route, and watch your flight progress live dynamically over the map.",
    imageUrl: "https://placehold.co/800x600/e2e8f0/475569?text=Live+Route+Tracker",
    imageAlt: "Live Route Tracking",
  },
];

export function PilotDeepDiveSection() {
  return (
    <section className="bg-transparent font-sans relative pt-24 pb-32 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 relative items-start">
          {/* Left Sticky Column */}
          <div className="w-full md:w-1/3 md:sticky md:top-32 h-auto mb-12 md:mb-0">
            <SectionHeader
              eyebrow="Pilot Toolkit"
              title="In the cockpit."
              subtitle="Built for immersion."
              description="Take the controls. Review briefings, track your passengers, and follow the exact route."
              centered={false}
            />
          </div>

          {/* Right Scrolling Column */}
          <div className="w-full md:w-2/3 flex flex-col gap-32 md:gap-48 pb-16">
            {pilotFeatures.map((feature) => (
              <DeepDiveCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
