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
  imageUrl,
  imageAlt = "Feature Screenshot",
  aspectRatioClass = "pt-[60%] md:pt-[50%]",
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

      {/* <div
        className={`w-full relative rounded-4xl overflow-hidden backdrop-blur-2xl bg-white/70 dark:bg-black/40 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl cursor-default
        transition-all duration-500 ease-out hover:scale-[1.02] hover:rotate-y-2 hover:-rotate-x-1 hover:shadow-indigo-500/10`}
      >
        <div className={aspectRatioClass}></div>
        <img
          src={imageUrl}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          alt={imageAlt}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-white/5 dark:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div> */}
    </div>
  );
}
