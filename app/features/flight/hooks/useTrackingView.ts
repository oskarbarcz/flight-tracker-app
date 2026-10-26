import { useState } from "react";
import { automaticTrackingView, TrackingView } from "~/features/flight/lib/trackingView";
import type { FlightStatus } from "~/features/flight/model";

type ManualChoice = {
  view: TrackingView;
  overrides: TrackingView;
};

export type TrackingViewState = {
  view: TrackingView;
  select: (view: TrackingView) => void;
};

export function useTrackingView(status: FlightStatus | null, tabSlug: string | undefined): TrackingViewState {
  const automatic = status === null ? TrackingView.Briefing : automaticTrackingView(status);
  const [choice, setChoice] = useState<ManualChoice | null>(null);
  const [seenTabSlug, setSeenTabSlug] = useState<string | undefined>(undefined);

  const select = (view: TrackingView) => setChoice({ view, overrides: automatic });

  if (status !== null && tabSlug !== seenTabSlug) {
    setSeenTabSlug(tabSlug);

    if (tabSlug !== undefined) {
      select(TrackingView.Briefing);
    }
  }

  const isManual = choice !== null && choice.overrides === automatic && choice.view !== automatic;

  return { view: isManual ? choice.view : automatic, select };
}
