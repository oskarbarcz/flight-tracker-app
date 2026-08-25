import React, { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { cabinFacts, centimetresOf } from "~/features/cabin-layout/lib/cabinFacts";
import { CABIN_FILLS } from "~/features/cabin-layout/lib/seatAppearance";
import type { CabinClass, CabinSeatMapDeck } from "~/features/cabin-layout/model";
import { toHuman } from "~/i18n/translate";
import { SpecRow } from "~/shared/ui/Display/SpecRow";

type Props = {
  deck: CabinSeatMapDeck;
  onActiveChange: (cabin: CabinClass | null) => void;
};

export function CabinDescriptions({ deck, onActiveChange }: Props) {
  const facts = useMemo(() => cabinFacts(deck), [deck]);
  const [pinned, setPinned] = useState<CabinClass | null>(null);
  const [hovered, setHovered] = useState<CabinClass | null>(null);

  function announce(cabin: CabinClass | null) {
    onActiveChange(cabin);
  }

  function cabinUnder(event: React.SyntheticEvent): CabinClass | null {
    const row = (event.target as HTMLElement).closest<HTMLElement>("[data-cabin]");
    return (row?.dataset.cabin as CabinClass | undefined) ?? null;
  }

  function trackPointer(event: React.PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const cabin = cabinUnder(event);
    if (cabin !== hovered) {
      setHovered(cabin);
      announce(cabin ?? pinned);
    }
  }

  function leavePointer(event: React.PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    setHovered(null);
    announce(pinned);
  }

  function trackFocus(event: React.FocusEvent<HTMLUListElement>) {
    const cabin = cabinUnder(event);
    setHovered(cabin);
    announce(cabin ?? pinned);
  }

  function clearHover() {
    setHovered(null);
    announce(pinned);
  }

  function pin(cabin: CabinClass) {
    const next = pinned === cabin ? null : cabin;
    setPinned(next);
    announce(next ?? cabin);
  }

  if (facts.length === 0) {
    return (
      <p className="rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        LOPA describes no cabins for this deck.
      </p>
    );
  }

  const active = hovered ?? pinned;

  return (
    <ul
      className="divide-y divide-gray-200 dark:divide-gray-800"
      onPointerMove={trackPointer}
      onPointerLeave={leavePointer}
      onFocusCapture={trackFocus}
      onBlurCapture={clearHover}
    >
      {facts.map((fact) => {
        const isActive = active === fact.cabin;
        const definition = fact.definition;

        return (
          <li key={fact.cabin} data-cabin={fact.cabin} className="py-3">
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="min-w-0">
                <button
                  type="button"
                  aria-pressed={pinned === fact.cabin}
                  aria-label={`Pick out ${definition?.name ?? toHuman.cabinLayout.cabinClass(fact.cabin)} in the cabin diagram`}
                  onClick={() => pin(fact.cabin)}
                  className="flex cursor-pointer flex-wrap items-baseline gap-x-2 rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  <span
                    aria-hidden={true}
                    className={twMerge(
                      "size-2.5 shrink-0 translate-y-px rounded-xs border",
                      CABIN_FILLS[fact.cabin],
                      isActive && "ring-2 ring-indigo-500 ring-offset-1 dark:ring-indigo-400 dark:ring-offset-gray-900",
                    )}
                  />
                  {definition !== null && (
                    <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400">
                      {definition.code}
                    </span>
                  )}
                  <span
                    className={twMerge(
                      "text-sm font-bold transition-colors duration-150 motion-reduce:transition-none",
                      isActive ? "text-indigo-700 dark:text-indigo-300" : "text-gray-900 dark:text-white",
                    )}
                  >
                    {definition?.name ?? toHuman.cabinLayout.cabinClass(fact.cabin)}
                  </span>
                </button>

                <p className="mt-0.5 font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
                  {`${fact.seats} seats · rows ${fact.rows}`}
                  {fact.abreast !== null && ` · ${fact.abreast} abreast`}
                </p>

                {fact.dispute !== null && (
                  <p className="mt-2 max-w-[80ch] text-xs text-gray-500 dark:text-gray-400">
                    {`LOPA describes this cabin as ${fact.dispute.seats} seats over rows ${fact.dispute.rows}. The figures above come from the seats themselves.`}
                  </p>
                )}

                {definition === null && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    LOPA describes no cabin for these seats.
                  </p>
                )}

                {definition?.description != null && (
                  <p className="mt-2 max-w-[80ch] text-sm text-gray-600 dark:text-gray-300">{definition.description}</p>
                )}
              </div>

              {definition !== null && (
                <dl className="grid h-fit grid-cols-[auto_auto] gap-x-3 gap-y-2 sm:pt-0.5">
                  <SpecRow label="Seat pitch" value={definition.pitch} suffix={centimetresOf(definition.pitch)} />
                  <SpecRow label="Seat width" value={definition.width} suffix={centimetresOf(definition.width)} />
                  <SpecRow label="Seat recline" value={definition.recline} suffix={centimetresOf(definition.recline)} />
                </dl>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
