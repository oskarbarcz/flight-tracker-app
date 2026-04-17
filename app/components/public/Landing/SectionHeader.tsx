import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
  maxWidth?: string;
  className?: string;
}

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
        {subtitle && <span className="block text-gray-400 dark:text-gray-600 mt-2">{subtitle}</span>}
      </h3>

      {description && (
        <p
          className={`mt-6 text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed ${centered ? "mx-auto" : ""} ${maxWidth}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
