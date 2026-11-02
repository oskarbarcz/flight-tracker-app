import React, { useRef } from "react";
import { useMapSettings } from "~/app-state/useMapSettings";
import { FixInfoCard } from "~/features/route/components/Chart/FixInfoCard";
import { usePlannedRoute } from "~/features/route/hooks/useRouteBriefing";
import type { FixInsight } from "~/features/route/lib/routeInsights";
import type { PlannedRouteFix } from "~/features/route/model";
import { useFloatingPanel } from "~/shared/hooks/useFloatingPanel";
import type { MapFocus, MapFocusInsets } from "~/shared/lib/mapFocus";

const BOTTOM_BAR_HEIGHT = 88;
const FIX_ZOOM = 8;

type Props = {
  isOpen: boolean;
  topInset: number;
  onClose: () => void;
  onFocus: (focus: MapFocus) => void;
};

function freeMapArea(area: DOMRect, card: DOMRect, topInset: number): MapFocusInsets {
  const isBesideCard = card.width < area.width / 2;

  return {
    top: isBesideCard ? topInset : topInset + card.bottom - area.top,
    right: isBesideCard ? area.right - card.left : 0,
    bottom: BOTTOM_BAR_HEIGHT,
  };
}

export function TrackingFixCard({ isOpen, topInset, onClose, onFocus }: Props) {
  const plannedRoute = usePlannedRoute();
  const { mapSettings, updateMapSettings, intent } = useMapSettings();
  const areaRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const insights = plannedRoute?.insights ?? [];
  const index = insights.findIndex(({ fix }) => fix.ordinal === plannedRoute?.selectedOrdinal);
  const insight: FixInsight | undefined = insights[index];
  const { isRendered, panelProps } = useFloatingPanel(isOpen && mapSettings.routeDisplay !== "hide", panelRef);

  if (plannedRoute === null || insight === undefined || !isRendered) {
    return null;
  }

  const centerOn = ({ latitude, longitude }: PlannedRouteFix, zoom: number | null) => {
    if (mapSettings.autoCenter) {
      updateMapSettings({ ...mapSettings, mode: intent === null ? mapSettings.mode : "manual", autoCenter: false });
    }

    const area = areaRef.current?.getBoundingClientRect();
    const card = panelRef.current?.getBoundingClientRect();

    if (area !== undefined && card !== undefined) {
      onFocus({ position: [latitude, longitude], zoom, insets: freeMapArea(area, card, topInset) });
    }
  };

  const stepTo = (target: FixInsight | undefined) => {
    if (target === undefined) {
      return undefined;
    }

    return () => {
      plannedRoute.select(target.fix.ordinal);
      centerOn(target.fix, null);
    };
  };

  return (
    <div
      ref={areaRef}
      className="pointer-events-none absolute inset-x-0 z-20 md:overflow-hidden md:[scrollbar-gutter:stable]"
      style={{ top: topInset, bottom: BOTTOM_BAR_HEIGHT }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-start justify-end px-3 pt-3 md:px-6">
        <div
          {...panelProps}
          ref={panelRef}
          className="floating-panel pointer-events-auto flex max-h-[60%] w-full max-w-88 flex-col md:max-h-full"
        >
          <FixInfoCard
            insight={insight}
            onClose={onClose}
            onPrevious={stepTo(insights[index - 1])}
            onNext={stepTo(insights[index + 1])}
            onCenter={() => centerOn(insight.fix, FIX_ZOOM)}
            className="min-h-0"
          />
        </div>
      </div>
    </div>
  );
}
