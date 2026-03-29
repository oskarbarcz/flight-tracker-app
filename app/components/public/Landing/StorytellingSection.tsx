import React from "react";
import { FaHeadset, FaPlaneDeparture } from "react-icons/fa";

export function StorytellingSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* The Operator Block */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24 mb-24">
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 mx-auto lg:mx-0">
              <FaHeadset className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Control the Airline Operations
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Start your journey in the Ops Center. As an Operator, you control the fleet size, manage intricate flight schedules, and oversee rotation timelines. Generate rigorous loadsheets and specify passenger numbers so every flight launches perfectly synced—before the pilots even turn the battery on.
            </p>
          </div>
          <div className="flex-1 w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 relative">
            <div className="relative w-full pb-[60%] bg-gray-100 dark:bg-gray-800">
              <img
                src="https://placehold.co/800x600/e2e8f0/475569?text=Operator+Dashboard+Screenshot"
                alt="Operator Operations Dashboard Placeholder"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* The Pilot Block */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 text-center lg:text-left">
          <div className="flex-1 w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 relative mb-12 lg:mb-0">
            <div className="relative w-full pb-[60%] bg-gray-100 dark:bg-gray-800">
              <img
                src="https://placehold.co/800x600/e2e8f0/475569?text=Pilot+EFB+Screenshot"
                alt="Pilot EFB Tracking Placeholder"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 mx-auto lg:mx-0">
              <FaPlaneDeparture className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Execute as the Pilot in Command
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Check in for your assigned flight via the Pilot EFB. Pull the generated loadsheet data natively into your simulator and prepare for departure. Throughout your journey, you'll log critical real-time events—block times, airborne status, and landing reports—bringing the operator’s plan to life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
