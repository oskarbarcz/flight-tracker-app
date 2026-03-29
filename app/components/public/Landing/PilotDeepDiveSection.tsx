import React from "react";

export function PilotDeepDiveSection() {
  return (
    <section className="bg-transparent font-sans relative pt-24 pb-32 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 relative items-start">
          
          {/* Left Sticky Column */}
          <div className="w-full md:w-1/3 md:sticky md:top-32 h-auto mb-12 md:mb-0">
            <h2 className="text-sm font-bold tracking-widest text-purple-600 dark:text-purple-400 mb-4 uppercase">
              Pilot Toolkit
            </h2>
            <p className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1]">
              In the cockpit.
              <span className="block text-gray-400 dark:text-gray-600 mt-2">Built for immersion.</span>
            </p>
            <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 font-medium">
              Take the controls. Review briefings, track your passengers, and follow the exact route.
            </p>
          </div>

          {/* Right Scrolling Column */}
          <div className="w-full md:w-2/3 flex flex-col gap-32 md:gap-48 pb-16">
            
            {/* 1. Professional Flight Briefings */}
            <div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1] mb-6">
                Professional Flight Briefings.
              </h3>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
                Get loadsheets, confirm them seamlessly, and dive into the most professional briefing customized for your flight simulation purposes.
              </p>
              <div className="w-full relative rounded-[2rem] overflow-hidden bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
                <div className="pt-[60%] md:pt-[50%]"></div>
                <img
                  src="https://placehold.co/1200x600/e2e8f0/475569?text=Pilot+EFB+Briefing"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Pilot Flight Briefing"
                />
              </div>
            </div>

            {/* 2. Crew & Passenger Awareness */}
            <div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1] mb-6">
                Know your crew. Know your passengers.
              </h3>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
                Connect deeply with your simulation ecosystem. Review the generated manifests, track boarding natively, and coordinate exactly who is riding along with you.
              </p>
              <div className="w-full relative rounded-[2rem] overflow-hidden bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
                <div className="pt-[100%] md:pt-[70%] lg:pt-[75%]"></div>
                <img
                  src="https://placehold.co/800x600/e2e8f0/475569?text=Passenger+%26+Crew+Manifest"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Crew and Passenger Tracking"
                />
              </div>
            </div>

            {/* 3. Live Tracking */}
            <div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1] mb-6">
                Watch it unfold live.
              </h3>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
                Know your departure airport intimately, review your exact route, and watch your flight progress live dynamically over the map.
              </p>
              <div className="w-full relative rounded-[2rem] overflow-hidden bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
                <div className="pt-[100%] md:pt-[70%] lg:pt-[75%]"></div>
                <img
                  src="https://placehold.co/800x600/e2e8f0/475569?text=Live+Route+Tracker"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Live Route Tracking"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
