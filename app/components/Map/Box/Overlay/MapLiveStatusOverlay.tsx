"use client";

export default function MapLiveStatusOverlay() {
  return (
    <div className="absolute top-3 left-3 bg-gray-100 w-fit flex items-center gap-2 rounded-lg px-3 py-1.5 dark:bg-gray-900">
      <span className="bg-red-600 h-3 rounded-full w-3 inline-block"></span>
      <span className="uppercase font-bold text-xs animate-pulse">Live</span>
    </div>
  );
}
