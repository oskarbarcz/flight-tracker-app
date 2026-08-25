import React from "react";
import { twMerge } from "tailwind-merge";
import type { PositionAppearance } from "~/features/cargo-hold/lib/holdReading";

type Props = {
  designator: string;
  appearance: PositionAppearance;
  tapered: boolean;
  showLabel: boolean;
  style: React.CSSProperties;
  onOpen: (element: HTMLButtonElement) => void;
  onClose: () => void;
};

const BASE =
  "absolute flex items-center justify-center rounded-[2px] border text-[11px] font-bold leading-none tracking-wide text-gray-600 transition-[scale,box-shadow,opacity] duration-[90ms] ease-out hover:z-10 hover:scale-[1.12] hover:ring-1 hover:ring-gray-900 focus-visible:z-10 focus-visible:scale-[1.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 motion-reduce:transition-none dark:text-gray-200 dark:hover:ring-white";

function PositionControl({ designator, appearance, tapered, showLabel, style, onOpen, onClose }: Props) {
  return (
    <button
      type="button"
      data-position={designator}
      aria-label={appearance.description}
      style={style}
      className={twMerge(BASE, appearance.fill)}
      onMouseEnter={(event) => onOpen(event.currentTarget)}
      onMouseLeave={onClose}
      onFocus={(event) => onOpen(event.currentTarget)}
      onBlur={onClose}
    >
      {showLabel && <span className="truncate px-0.5">{designator}</span>}
      {appearance.markers !== undefined && appearance.markers.length > 0 && (
        <span className="absolute inset-x-0 top-0 flex items-center justify-center gap-0.5 pt-px">
          {appearance.markers.map((marker) => (
            <marker.icon key={marker.key} aria-hidden={true} className="size-2.5 shrink-0" />
          ))}
        </span>
      )}
      {tapered && (
        <span
          aria-hidden={true}
          className="absolute inset-y-0 right-0 w-[3px] rounded-r-[2px] bg-[repeating-linear-gradient(135deg,transparent,transparent_1.5px,rgba(17,24,39,0.55)_1.5px,rgba(17,24,39,0.55)_3px)] dark:bg-[repeating-linear-gradient(135deg,transparent,transparent_1.5px,rgba(249,250,251,0.6)_1.5px,rgba(249,250,251,0.6)_3px)]"
        />
      )}
    </button>
  );
}

export const HoldPositionTile = React.memo(PositionControl);
