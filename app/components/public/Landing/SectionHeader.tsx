import React from "react";

interface SectionHeaderProps {
  /**
   * Small uppercase text above the title.
   * e.g. "USER LIFECYCLE"
   */
  eyebrow?: string;
  /**
   * The main high-contrast section title.
   */
  title: string;
  /**
   * Optional subtitle or secondary text line.
   */
  subtitle?: string;
  /**
   * The explanatory paragraph below the title.
   */
  description?: string;
  /**
   * Whether to center-align the content.
   * Default: true
   */
  centered?: boolean;
  /**
   * Width constraint for the description.
   * Default: "max-w-2xl"
   */
  maxWidth?: string;
  className?: string;
}

/**
 * SectionHeader - A responsive header component for landing page sections.
 * Optimized for cinematic typography and premium legibility.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  description,
  centered = true,
  maxWidth = "max-w-2xl",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`${centered ? "text-center" : "text-left"} ${className}`}>
      {eyebrow && (
        <h2 className="text-sm font-bold tracking-widest text-[#5865F2] dark:text-indigo-400 mb-4 uppercase">
          {eyebrow}
        </h2>
      )}
      
      <h3 className={`text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1]`}>
        {title}
        {subtitle && (
          <span className="block text-gray-400 dark:text-gray-600 mt-2">
            {subtitle}
          </span>
        )}
      </h3>

      {description && (
        <p className={`mt-6 text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed ${centered ? "mx-auto" : ""} ${maxWidth}`}>
          {description}
        </p>
      )}
    </div>
  );
}
