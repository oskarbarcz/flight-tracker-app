import React from "react";
import type { IconType } from "react-icons";

interface StoryBlockProps {
  icon: IconType;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  isReversed?: boolean;
}

export function StoryBlock({
  icon: Icon,
  title,
  description,
  imageUrl,
  imageAlt = "Feature illustration",
  isReversed = false,
}: StoryBlockProps) {
  return (
    <div
      className={`flex flex-col-reverse ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-24 mb-24 last:mb-0`}
    >
      {/* Text Content */}
      <div className="flex-1 w-full text-center lg:text-left">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 mx-auto lg:mx-0 shadow-sm">
          <Icon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl leading-snug">
          {title}
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 font-medium">{description}</p>
      </div>

      {/* Image Content */}
      <div className="flex-1 w-full perspective-[2000px] relative">
        <div
          className={`relative w-full pb-[60%] rounded-2xl overflow-hidden backdrop-blur-2xl bg-white/70 dark:bg-black/40 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl cursor-default
          transition-all duration-500 ease-out hover:scale-[1.02] hover:rotate-y-2 hover:-rotate-x-1 hover:shadow-indigo-500/10`}
        >
          <img src={imageUrl} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
