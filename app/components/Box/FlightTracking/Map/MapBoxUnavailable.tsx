"use client";

import image from "~/assets/map.jpg";

export function MapBoxUnavailable() {
  return (
    <div className="w-full h-full rounded-2xl">
      <div className="relative h-full w-full">
        <img
          className="rounded-4xl mask-radial-from-10% h-full w-full object-cover z-0 blur-[2px] dark:invert"
          src={image}
          alt="Map illustration"
        />
        <span className="absolute flex parent items-center justify-center z-10 top-1/2 left-1/2 -translate-1/2 text-gray-800 dark:text-white">
          Flight path preview is not available for this flight.
        </span>
      </div>
    </div>
  );
}
