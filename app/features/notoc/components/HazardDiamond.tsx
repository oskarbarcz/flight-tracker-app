import React from "react";
import type { HazardClass } from "~/features/cargo-manifest/model";
import { hazardMark } from "~/features/notoc/lib/hazardLabel";

type Props = {
  hazardClass: HazardClass;
};

export function HazardDiamond({ hazardClass }: Props) {
  const mark = hazardMark(hazardClass);

  return (
    <span className="inline-flex size-12 shrink-0 rotate-45 overflow-hidden border border-black" aria-hidden={true}>
      <span className="flex w-full flex-col" style={{ backgroundColor: mark.ground }}>
        <span className="flex flex-1 items-end justify-center" style={{ color: mark.ink }}>
          <span className="-rotate-45 text-[13px] leading-none">{mark.symbol}</span>
        </span>
        <span
          className="flex flex-1 items-start justify-center"
          style={{
            backgroundColor: mark.lowerGround ?? mark.ground,
            color: mark.lowerGround === "#000000" ? "#FFFFFF" : mark.ink,
          }}
        >
          <span className="-rotate-45 text-[11px] font-bold leading-none">{hazardClass}</span>
        </span>
      </span>
    </span>
  );
}
