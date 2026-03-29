import React from "react";
import { IconType } from "react-icons";

interface StoryBlockProps {
  /**
   * Icon from a library like react-icons.
   */
  icon: IconType;
  /**
   * The main headline for this block.
   */
  title: string;
  /**
   * The detailed storytelling text.
   */
  description: string;
  /**
   * URL for the accompanying screenshot or image.
   */
  imageUrl: string;
  /**
   * Alt text for the image.
   */
  imageAlt?: string;
  /**
   * Whether to flip the order (image on left, text on right).
   * Default: false (text on left, image on right)
   */
  isReversed?: boolean;
}

/**
 * StoryBlock - A modular block for text + image storytelling.
 * Handles responsive stacking and alternating layouts.
 */
export function StoryBlock({
  icon: Icon,
  title,
  description,
  imageUrl,
  imageAlt = "Feature illustration",
  isReversed = false,
}: StoryBlockProps) {
  return (
    <div className={`flex flex-col-reverse ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 lg:gap-24 mb-24 last:mb-0`}>
      {/* Text Content */}
      <div className="flex-1 w-full text-center lg:text-left">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 mx-auto lg:mx-0 shadow-sm">
          <Icon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl leading-snug">
          {title}
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 font-medium">
          {description}
        </p>
      </div>

      {/* Image Content */}
      <div className="flex-1 w-full [perspective:2000px] relative">
        <div className={`relative w-full pb-[60%] rounded-2xl overflow-hidden backdrop-blur-2xl bg-white/70 dark:bg-black/40 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl cursor-default
          transition-all duration-500 ease-out hover:scale-[1.02] hover:rotate-y-[2deg] hover:-rotate-x-[1deg] hover:shadow-indigo-500/10`}>
          <img
            src={imageUrl}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
