import React from "react";
import { LuTowerControl } from "react-icons/lu";
import { AirportShape } from "~/features/airport/components/Airport/AirportShape";
import { hasOutline } from "~/features/airport/lib/outline";
import type { Coordinates } from "~/shared/models/coordinates";
import { OptionAvatarFrame } from "~/shared/ui/Form/AdvancedSelect/OptionAvatarFrame";

type Props = {
  shape: Coordinates[] | null;
};

export function AirportShapeFrame({ shape }: Props) {
  if (!hasOutline(shape)) {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500">
        <LuTowerControl className="size-3.5" aria-hidden />
        <span className="sr-only">No outline</span>
      </span>
    );
  }

  return (
    <OptionAvatarFrame>
      <AirportShape shape={shape} />
    </OptionAvatarFrame>
  );
}
