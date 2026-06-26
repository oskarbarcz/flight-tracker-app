import React from "react";

interface DeepDiveCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  aspectRatioClass?: string;
  className?: string;
}

export function DeepDiveCard({
  title,
  description,
  imageUrl: _imageUrl,
  imageAlt: _imageAlt = "Feature Screenshot",
  aspectRatioClass: _aspectRatioClass = "pt-[60%] md:pt-[50%]",
  className = "",
}: DeepDiveCardProps) {
  return (
    <div className={`group perspective-[2000px] animate-in fade-in slide-in-from-bottom-8 duration-700 ${className}`}>
      <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1] mb-6">
        {title}
      </h3>
      <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8 max-w-2xl">
        {description}
      </p>
    </div>
  );
}
