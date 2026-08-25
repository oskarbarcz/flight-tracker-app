import React from "react";
import { twMerge } from "tailwind-merge";
import { HoldPositionTile } from "~/features/cargo-hold/components/HoldDiagram/HoldPositionTile";
import { type DeckPlacement, envelopeClipPath, envelopePoints } from "~/features/cargo-hold/lib/holdFrame";
import type { HoldReading, PositionAppearance } from "~/features/cargo-hold/lib/holdReading";
import { CompartmentLoading, type HoldPosition } from "~/features/cargo-hold/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  placement: DeckPlacement;
  heightPx: number;
  reading: HoldReading;
  width: number;
  labelWidthPx: number;
  onOpen: (position: HoldPosition, appearance: PositionAppearance, element: HTMLButtonElement) => void;
  onClose: () => void;
};

const INSET_PX = 10;
const COMPARTMENT_LABEL_PX = 58;

export function HoldDeckPlan({ placement, heightPx, reading, width, labelWidthPx, onOpen, onClose }: Props) {
  const inner = heightPx - INSET_PX * 2;

  return (
    <div className="flex flex-col">
      <div style={{ width }} className="relative h-4">
        {placement.compartments.map((compartment) => (
          <span
            key={`label-${compartment.compartment.number}`}
            style={{ left: `${compartment.start * 100}%`, width: `${compartment.length * 100}%` }}
            className="absolute truncate px-1 text-center text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
          >
            {compartment.length * width >= COMPARTMENT_LABEL_PX
              ? `${compartment.compartment.number} · ${toHuman.cargoHold.compartmentName(compartment.compartment.name)}`
              : compartment.compartment.number}
          </span>
        ))}
      </div>

      <div style={{ width, height: heightPx }} className="relative">
        <div style={{ clipPath: envelopeClipPath() }} className="absolute inset-0 bg-gray-50 dark:bg-gray-800">
          {placement.compartments.map((compartment, index) => (
            <div
              key={`cell-${compartment.compartment.number}`}
              style={{ left: `${compartment.start * 100}%`, width: `${compartment.length * 100}%` }}
              className={twMerge(
                "absolute inset-y-0",
                index > 0 && "border-l border-gray-400 dark:border-gray-500",
                compartment.compartment.loading === CompartmentLoading.Loose
                  ? "bg-[repeating-linear-gradient(135deg,transparent,transparent_4px,rgba(107,114,128,0.22)_4px,rgba(107,114,128,0.22)_8px)]"
                  : index % 2 === 1 && "bg-gray-100/70 dark:bg-gray-700/30",
              )}
            />
          ))}
        </div>

        <svg
          aria-hidden={true}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <polygon
            points={envelopePoints()}
            fill="none"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            className="stroke-gray-300 dark:stroke-gray-600"
          />
        </svg>

        {placement.compartments.flatMap((compartment) =>
          compartment.positions.map((slot) => {
            const appearance = reading.appearanceOf(slot.position);
            return (
              <HoldPositionTile
                key={`${placement.deck.deck}-${slot.position.designator}`}
                designator={slot.position.designator}
                appearance={appearance}
                tapered={slot.tapered}
                showLabel={slot.length * width >= labelWidthPx}
                style={{
                  left: `calc(${slot.start * 100}% + 1px)`,
                  width: `calc(${slot.length * 100}% - 2px)`,
                  top: `${INSET_PX + slot.top * inner}px`,
                  height: `calc(${slot.height * inner}px - 2px)`,
                }}
                onOpen={(element) => onOpen(slot.position, appearance, element)}
                onClose={onClose}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
