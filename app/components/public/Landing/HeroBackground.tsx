import React from "react";

export function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 w-full h-full bg-blue-50/50 dark:hidden transition-opacity duration-1000">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2560&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35 brightness-110 saturate-[0.85]"
          alt="Gray and white airplane in flight near clear blue sky"
        />
      </div>
      <div className="absolute inset-0 w-full h-full bg-black hidden dark:block transition-opacity duration-1000">
        <img
          src="https://images.unsplash.com/photo-1587408811730-1a978e6c407d?q=80&w=2560&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-50 brightness-[0.6] contrast-125"
          alt="Airliner cockpit at dusk"
        />
      </div>

      <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-white dark:from-gray-950 via-white/80 dark:via-gray-950/80 to-transparent z-0 pointer-events-none transition-colors duration-500" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-gray-50 dark:from-[#0c0c0e] via-gray-50/90 dark:via-[#0c0c0e]/90 to-transparent z-0 pointer-events-none transition-colors duration-500" />
      <div className="absolute inset-y-0 left-0 w-48 bg-linear-to-r from-white dark:from-gray-950 via-white/60 dark:via-gray-950/60 to-transparent z-0 pointer-events-none transition-colors duration-500" />
      <div className="absolute inset-y-0 right-0 w-48 bg-linear-to-l from-white dark:from-gray-950 via-white/60 dark:via-gray-950/60 to-transparent z-0 pointer-events-none transition-colors duration-500" />
    </>
  );
}
