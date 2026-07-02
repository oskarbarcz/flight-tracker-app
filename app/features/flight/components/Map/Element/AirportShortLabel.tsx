import { FaPlaneCircleExclamation } from "react-icons/fa6";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import type { Airport } from "~/features/airport";

type Props = {
  airport: Airport;
  variant?: "primary" | "diversion";
};

export function AirportShortLabel({ airport, variant = "primary" }: Props) {
  if (variant === "diversion") {
    return (
      <span className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-2 py-1 text-xs shadow-sm whitespace-nowrap">
        <FaPlaneCircleExclamation className="text-red-600 shrink-0" size={12} />
        <span className="leading-none text-red-700">{airport.name}</span>
        <span className="leading-none font-mono font-bold text-red-900">{airport.iataCode}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-2 py-1 text-xs shadow-sm whitespace-nowrap">
      <HiOutlineGlobeAlt className="text-sky-500 shrink-0" size={14} />
      <span className="leading-none text-gray-700">{airport.name}</span>
      <span className="leading-none font-mono font-bold text-gray-900">{airport.iataCode}</span>
    </span>
  );
}
