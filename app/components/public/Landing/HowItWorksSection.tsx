import React, { useEffect, useRef, useState } from "react";
import {
  FaClipboardCheck,
  FaFileSignature,
  FaMapLocationDot,
  FaPlane,
  FaPlaneDeparture,
  FaTowerBroadcast,
} from "react-icons/fa6";
import { SectionDivider } from "./SectionDivider";
import { SectionHeader } from "./SectionHeader";
import { TimelineStepDesktop, TimelineStepMobile } from "./TimelineStep";

export function HowItWorksSection() {
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cachedSentinel = sentinelRef.current;
    if (!cachedSentinel) return;

    const observer = new IntersectionObserver(
      ([e]) => {
        setIsStuck(e.intersectionRatio === 0);
      },
      {
        threshold: [0, 1],
        rootMargin: "-64px 0px 0px 0px",
      },
    );

    observer.observe(cachedSentinel);
    return () => observer.unobserve(cachedSentinel);
  }, []);

  const steps = [
    {
      role: "operator",
      title: "Manage Fleet",
      description:
        "Operator manages the airline fleet dynamically. Oversee complex rotations, aircraft readiness, maintenance windows, and ensure every tail number is optimally assigned to daily schedules without conflict.",
      icon: FaPlane,
    },
    {
      role: "operator",
      title: "Create Flight",
      description:
        "Operator generates the specific flight leg. Compile and lock the initial loadsheet, verify passenger counts, assign the gate, and prepare vital briefing parameters for the approaching crew.",
      icon: FaFileSignature,
    },
    {
      role: "pilot",
      title: "Check In",
      description:
        "Pilot checks into the cockpit via the EFB. Securely claim your generated flight, review the Operator's prepared briefing data, verify the loadsheet, and initialize the aircraft systems.",
      icon: FaClipboardCheck,
    },
    {
      role: "pilot",
      title: "Report Data",
      description:
        "Pilot provides real-time telemetry natively. Report vital live data securely, log your off-block times, update runway conditions, and synchronize your gate statuses directly back to the ops center.",
      icon: FaTowerBroadcast,
    },
    {
      role: "pilot",
      title: "Track & Brief",
      description:
        "Pilot leverages live telemetry integrations. Track your exact route over the live map, maintain ultimate situational awareness, and interact heavily with the data-rich simulation ecosystem.",
      icon: FaMapLocationDot,
    },
    {
      role: "pilot",
      title: "Perform Safely",
      description:
        "Pilot executes the remaining phases of flight safely. Live telemetry, including altitudes and landing rates, is constantly beamed back to operations to complete the lifecycle.",
      icon: FaPlaneDeparture,
    },
  ];

  return (
    <section className="pt-6 bg-gray-50 dark:bg-[#0c0c0e] relative">
      {/* Background Bloom Blobs — providing texture for glassmorphism */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-125 h-125 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 pb-0 md:pb-48">
        <div ref={sentinelRef} className="absolute top-0 h-16 w-full pointer-events-none" />
        <div
          className={`sticky top-15 z-30 transition-all duration-500 ${
            isStuck
              ? "bg-gray-50/90 dark:bg-[#0c0c0e]/90 backdrop-blur-xl py-4 md:py-8 border-b border-gray-200 dark:border-gray-800 shadow-md md:shadow-lg"
              : "bg-transparent py-12 border-b border-transparent shadow-none"
          }`}
        >
          <SectionHeader
            eyebrow="User Lifecycle"
            title="A Seamless Flow."
            description="Watch exactly how Operators push data to the cockpit, and how Pilots beam telemetry back down."
            className="mx-auto max-w-7xl px-6 lg:px-8"
          />
        </div>
        <div className="hidden md:block mx-auto max-w-7xl px-6 lg:px-8 relative mt-24">
          <div className="absolute left-1/2 top-4 -bottom-48 w-1 -ml-[0.5px] rounded-full bg-linear-to-b from-indigo-500 via-indigo-500 to-purple-500 opacity-20"></div>
          <div className="space-y-24">
            {steps.map((step, index) => (
              <TimelineStepDesktop key={`d-${step.title}`} index={index} {...step} isEven={index % 2 === 0} />
            ))}
          </div>
        </div>

        <div className="md:hidden mx-auto max-w-7xl px-4 relative mt-12">
          <div className="space-y-10 relative">
            <div className="absolute left-5 top-4 -bottom-10 w-1 -ml-[0.5px] rounded-full bg-linear-to-b from-indigo-500 via-indigo-500 to-purple-500 opacity-20 z-0"></div>
            {steps.map((step, index) => (
              <TimelineStepMobile key={`m-${step.title}`} index={index} {...step} />
            ))}
          </div>
        </div>
      </div>

      <SectionDivider height="h-24 md:h-48" zIndex="z-20" />
    </section>
  );
}
