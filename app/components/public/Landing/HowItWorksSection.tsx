import React from "react";
import {
  FaPlane,
  FaFileSignature,
  FaClipboardCheck,
  FaTowerBroadcast,
  FaMapLocationDot,
  FaPlaneDeparture,
} from "react-icons/fa6";

export function HowItWorksSection() {
  const steps = [
    {
      role: "operator",
      title: "Manage Fleet",
      description: "Operator manages the airline fleet dynamically. Oversee complex rotations, aircraft readiness, maintenance windows, and ensure every tail number is optimally assigned to daily schedules without conflict.",
      icon: FaPlane,
    },
    {
      role: "operator",
      title: "Create Flight",
      description: "Operator generates the specific flight leg. Compile and lock the initial loadsheet, verify passenger counts, assign the gate, and prepare vital briefing parameters for the approaching crew.",
      icon: FaFileSignature,
    },
    {
      role: "pilot",
      title: "Check In",
      description: "Pilot checks into the cockpit via the EFB. Securely claim your generated flight, review the Operator's prepared briefing data, verify the loadsheet, and initialize the aircraft systems.",
      icon: FaClipboardCheck,
    },
    {
      role: "pilot",
      title: "Report Data",
      description: "Pilot provides real-time telemetry natively. Report vital live data securely, log your off-block times, update runway conditions, and synchronize your gate statuses directly back to the ops center.",
      icon: FaTowerBroadcast,
    },
    {
      role: "pilot",
      title: "Track & Brief",
      description: "Pilot leverages live telemetry integrations. Track your exact route over the live map, maintain ultimate situational awareness, and interact heavily with the data-rich simulation ecosystem.",
      icon: FaMapLocationDot,
    },
    {
      role: "pilot",
      title: "Perform Safely",
      description: "Pilot executes the remaining phases of flight safely. Live telemetry, including altitudes and landing rates, is constantly beamed back to operations to complete the lifecycle.",
      icon: FaPlaneDeparture,
    },
  ];

  return (
    <section className="pt-24 bg-gray-50 dark:bg-[#0c0c0e] overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 pb-24 md:pb-48">
        <div className="mx-auto max-w-3xl text-center mb-24">
          <h2 className="text-sm font-bold tracking-widest text-[#5865F2] dark:text-[#5865F2] mb-4 uppercase">
            User Lifecycle
          </h2>
          <h3 className="text-5xl font-bold tracking-tighter text-gray-900 dark:text-white sm:text-7xl leading-[1.1]">
            A Seamless Flow.
          </h3>
          <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 font-medium">
            Watch exactly how Operators push data to the cockpit, and how Pilots beam telemetry back down.
          </p>
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Vertical Line */}
          <div className="absolute left-[36px] md:left-1/2 top-4 -bottom-48 w-1 -ml-[0.5px] rounded-full bg-gradient-to-b from-indigo-500 via-indigo-500 to-purple-500 opacity-20"></div>

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => {
              const isOperator = step.role === "operator";
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={step.title} className="relative flex flex-col md:flex-row items-center w-full">
                  {/* Desktop Layout */}
                  <div className={`hidden md:flex w-full ${isEven ? "flex-row-reverse" : "flex-row"} items-center`}>
                    <div className="w-[45%] flex">
                      <div
                        className={`w-full bg-white dark:bg-gray-900 p-8 rounded-[1.5rem] shadow-xl ring-1 ${
                          isOperator
                            ? "ring-indigo-500/20 shadow-indigo-500/10"
                            : "ring-purple-500/20 shadow-purple-500/10"
                        } hover:scale-[1.02] transition-transform duration-300 ease-out cursor-default`}
                      >
                        <h4
                          className={`text-2xl font-bold tracking-tight mb-3 ${
                            isOperator ? "text-indigo-600 dark:text-indigo-400" : "text-purple-600 dark:text-purple-400"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="w-[10%] flex justify-center z-10 shrink-0">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-gray-50 dark:border-[#0c0c0e] ${
                          isOperator ? "bg-indigo-500 text-white" : "bg-purple-500 text-white"
                        } shadow-lg relative`}
                      >
                        <Icon size={24} />
                      </div>
                    </div>

                    <div className="w-[45%] flex items-center justify-center">
                      <p
                        className={`text-[12rem] font-black opacity-[0.03] text-gray-900 dark:text-white select-none ${
                          isEven ? "text-right w-full pr-12" : "text-left w-full pl-12"
                        }`}
                      >
                        0{index + 1}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex w-full relative pl-20 pr-2 pb-8">
                    <div
                      className="absolute left-[13px] top-6 w-12 h-12 rounded-full flex items-center justify-center border-[3px] border-gray-50 dark:border-[#0c0c0e] shadow-lg z-10 bg-indigo-500 text-white"
                      style={{ backgroundColor: isOperator ? "#6366f1" : "#a855f7" }}
                    >
                      <Icon size={20} />
                    </div>

                    <div
                      className={`w-full bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl ring-1 ${
                        isOperator ? "ring-indigo-500/20 shadow-indigo-500/10" : "ring-purple-500/20 shadow-purple-500/10"
                      }`}
                    >
                      <h4
                        className={`text-2xl font-bold tracking-tight mb-3 ${
                          isOperator ? "text-indigo-600 dark:text-indigo-400" : "text-purple-600 dark:text-purple-400"
                        }`}
                      >
                        <span className="text-gray-900 dark:text-white mr-2 opacity-50">0{index + 1}.</span>
                        {step.title}
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fancy Section Change (Seamless Gradient Mist) */}
      <div className="absolute bottom-0 left-0 w-full h-[400px] bg-gradient-to-b from-transparent to-white dark:from-transparent dark:to-gray-950 pointer-events-none z-20"></div>
    </section>
  );
}
