import React from "react";
import { FaHeadset, FaPlaneDeparture } from "react-icons/fa6";
import { StoryBlock } from "./StoryBlock";

export function StorytellingSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* The Operator Block */}
        <StoryBlock
          icon={FaHeadset}
          title="Control the Airline Operations"
          description="Start your journey in the Ops Center. As an Operator, you control the fleet size, manage intricate flight schedules, and oversee rotation timelines. Generate rigorous loadsheets and specify passenger numbers so every flight launches perfectly synced—before the pilots even turn the battery on."
          imageUrl="https://placehold.co/800x600/e2e8f0/475569?text=Operator+Dashboard+Screenshot"
          imageAlt="Operator Operations Dashboard Placeholder"
          isReversed={false}
        />

        {/* The Pilot Block */}
        <StoryBlock
          icon={FaPlaneDeparture}
          title="Execute as the Pilot in Command"
          description="Check in for your assigned flight via the Pilot EFB. Pull the generated loadsheet data natively into your simulator and prepare for departure. Throughout your journey, you'll log critical real-time events—block times, airborne status, and landing reports—bringing the operator’s plan to life."
          imageUrl="https://placehold.co/800x600/e2e8f0/475569?text=Pilot+EFB+Screenshot"
          imageAlt="Pilot EFB Tracking Placeholder"
          isReversed={true}
        />

      </div>
    </section>
  );
}
