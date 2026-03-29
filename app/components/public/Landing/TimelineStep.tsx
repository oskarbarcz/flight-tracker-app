import React from "react";
import { IconType } from "react-icons";

interface TimelineStepProps {
  index: number;
  title: string;
  description: string;
  icon: IconType;
  role: string;
  isEven?: boolean;
}

/**
 * TimelineStepDesktop - A single step for the alternates-sides desktop timeline.
 */
export function TimelineStepDesktop({
  index,
  title,
  description,
  icon: Icon,
  role,
  isEven = false,
}: TimelineStepProps) {
  const isOperator = role === "operator";

  return (
    <div className="relative flex items-center w-full [perspective:2000px]">
      <div className={`flex w-full ${isEven ? "flex-row-reverse" : "flex-row"} items-center`}>
        {/* Content Card */}
        <div className="w-[45%] flex">
          <div
            className={`w-full relative overflow-hidden backdrop-blur-2xl p-8 rounded-[2rem] shadow-xl dark:shadow-2xl border border-gray-200 dark:border-white/10 cursor-default
              bg-white/70 dark:bg-black/40
              transition-all duration-500 ease-out hover:scale-[1.02] hover:rotate-y-[2deg] hover:-rotate-x-[1deg] hover:shadow-indigo-500/10`}
          >
            <h4
              className={`relative z-10 text-2xl font-bold tracking-tight mb-3 ${
                isOperator ? "text-indigo-600 dark:text-indigo-400" : "text-purple-600 dark:text-purple-400"
              }`}
            >
              {title}
            </h4>
            <p className="relative z-10 text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-medium">
              {description}
            </p>
          </div>
        </div>

        {/* Central Icon */}
        <div className="w-[10%] flex justify-center z-10 shrink-0">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-gray-50 dark:border-[#0c0c0e] ${
              isOperator ? "bg-indigo-500 text-white" : "bg-purple-500 text-white"
            } shadow-lg relative`}
          >
            <Icon size={24} />
          </div>
        </div>

        {/* Decorative Number */}
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
    </div>
  );
}

/**
 * TimelineStepMobile - A single step for the left-aligned mobile timeline.
 */
export function TimelineStepMobile({
  index,
  title,
  description,
  icon: Icon,
  role,
}: TimelineStepProps) {
  const isOperator = role === "operator";

  return (
    <div className="flex w-full relative pl-12 pr-1 pb-6 [perspective:1000px]">
      {/* Icon Circle */}
      <div
        className="absolute left-0 top-2.5 w-10 h-10 rounded-full flex items-center justify-center border-[2px] border-gray-50 dark:border-[#0c0c0e] shadow-lg z-10 text-white"
        style={{ backgroundColor: isOperator ? "#6366f1" : "#a855f7" }}
      >
        <Icon size={18} />
      </div>

      {/* Content Card */}
      <div className={`w-full relative overflow-hidden backdrop-blur-2xl p-5 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10
        bg-white/70 dark:bg-black/40
        transition-all duration-500 ease-out hover:scale-[1.02] hover:rotate-y-[2deg] hover:-rotate-x-[1deg]`}>
        <h4 className={`relative z-10 text-lg font-bold tracking-tight mb-1 ${isOperator ? "text-indigo-600 dark:text-indigo-400" : "text-purple-600 dark:text-purple-400"}`}>
          <span className="text-gray-900 dark:text-white mr-2 opacity-50">0{index + 1}.</span>
          {title}
        </h4>
        <p className="relative z-10 text-gray-700 dark:text-gray-300 font-medium leading-relaxed text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}
