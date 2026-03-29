import React from "react";

export function OperatorDeepDiveSection() {
  return (
    <section className="bg-transparent font-sans relative pt-24 pb-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 relative items-start">
          
          {/* Left Sticky Column */}
          <div className="w-full md:w-1/3 md:sticky md:top-32 h-auto mb-12 md:mb-0">
            <h2 className="text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400 mb-4 uppercase">
              Operator Toolkit
            </h2>
            <p className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1]">
              Everything you need.
              <span className="block text-gray-400 dark:text-gray-600 mt-2">All in one place.</span>
            </p>
            <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 font-medium">
              Control airline operations from a macroscopic view before the flights even push back.
            </p>
          </div>

          {/* Right Scrolling Column */}
          <div className="w-full md:w-2/3 flex flex-col gap-32 md:gap-48 pb-16">
            
            {/* 1. Complete Flight Management */}
            <div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1] mb-6">
                Complete Flight Management.
              </h3>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
                From initial scheduling to pinpoint precision on the loadsheet. Master every parameter before the engines even start.
              </p>
              <div className="w-full relative rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
                <div className="pt-[60%] md:pt-[50%]"></div>
                <img
                  src="https://placehold.co/1200x600/e2e8f0/475569?text=Flight+Management+Dashboard"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Flight Management View"
                />
              </div>
            </div>

            {/* 2. Complete Fleet Management */}
            <div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1] mb-6">
                Live Fleet Management.
              </h3>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
                See exactly where every aircraft is parked or flying. Track real-time fleet age and effortlessly manage complex daily crew rotations—all from a single, unified view.
              </p>
              <div className="w-full relative rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
                <div className="pt-[100%] md:pt-[70%] lg:pt-[75%]"></div>
                <img
                  src="https://placehold.co/800x600/e2e8f0/475569?text=Live+Fleet+Tracker"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Fleet Tracker Map"
                />
              </div>
            </div>

            {/* 3. Complete Airports Management */}
            <div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1] mb-6">
                Airports Intelligently Mapped.
              </h3>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
                Understand exactly where your airline zones reside. Locate active parking areas, define Schengen constraints, and coordinate massive ground operations visually.
              </p>
              <div className="w-full relative rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
                <div className="pt-[100%] md:pt-[70%] lg:pt-[75%]"></div>
                <img
                  src="https://placehold.co/800x600/e2e8f0/475569?text=Airports+Ground+Map"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Airport Management Chart"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
