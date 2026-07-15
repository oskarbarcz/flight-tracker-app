import type { ReactNode } from "react";
import { MapMaximizeButton } from "~/features/flight/components/Map/Box/Overlay/MapMaximizeButton";
import { MapShareLinks } from "~/features/flight/components/Map/Box/Overlay/MapShareLinks";

type Props = {
  children: ReactNode;
  flightId?: string;
  canShare?: boolean;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
};

export function MapTopBar({ children, flightId, canShare = false, isMaximized = false, onToggleMaximize }: Props) {
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
      {children}
      <div className="flex items-center gap-2">
        {canShare && flightId && <MapShareLinks flightId={flightId} />}
        {onToggleMaximize && <MapMaximizeButton isMaximized={isMaximized} onToggle={onToggleMaximize} />}
      </div>
    </div>
  );
}
