import type { ReactNode } from "react";
import { MapMaximizeButton } from "~/features/flight/components/Map/Box/Overlay/MapMaximizeButton";
import { MapShareLinks } from "~/features/flight/components/Map/Box/Overlay/MapShareLinks";

type Props = {
  children: ReactNode;
  center?: ReactNode;
  flightId?: string;
  canShare?: boolean;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
};

export function MapTopBar({
  children,
  center,
  flightId,
  canShare = false,
  isMaximized = false,
  onToggleMaximize,
}: Props) {
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-3 border-b border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex shrink-0 items-center">{children}</div>
      <div className="hidden min-w-0 flex-1 justify-center lg:flex">{center}</div>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {canShare && flightId && <MapShareLinks flightId={flightId} />}
        {onToggleMaximize && <MapMaximizeButton isMaximized={isMaximized} onToggle={onToggleMaximize} />}
      </div>
    </div>
  );
}
