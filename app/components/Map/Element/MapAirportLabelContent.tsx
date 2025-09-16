"use client";

type MapAirportLabelContentProps = {
  label: string;
};

export default function MapAirportLabelContent({label}: MapAirportLabelContentProps) {
  return (
    <span className="text-white font-bold whitespace-nowrap text-xs rounded-2xl py-1 px-2 bg-indigo-500">
    {label}
  </span>
  );
}
