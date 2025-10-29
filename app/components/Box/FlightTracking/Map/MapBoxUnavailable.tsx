"use client";

import image from "~/assets/map.jpg";

export function MapBoxUnavailable() {
  return (
    <div className="grow relative rounded-2xl overflow-hidden">
      <img
        className="absolute top-0 mask-radial-from-10% left-0 w-full h-full object-cover z-0 blur-[2px] dark:invert"
        src={image}
        alt="Map illustration"
      />
      <span className="absolute flex parent items-center justify-center z-10 top-1/2 left-1/2 -translate-1/2 text-gray-800 dark:text-white">
        Flight path preview is not available for this flight.
      </span>
    </div>
  );
}
