import type { Span } from "~/features/stats/lib/span";
import type { AircraftTypeStat } from "~/features/stats/model";

export function typesFirstFlownIn(types: AircraftTypeStat[], span: Span, upTo: Date): AircraftTypeStat[] {
  const end = span.to > upTo ? upTo : span.to;

  const lastMoment = new Date(end.getTime() + 86_399_999);

  return types
    .map((stat) => ({ stat, at: new Date(stat.firstFlownAt) }))
    .filter((entry) => entry.at >= span.from && entry.at <= lastMoment)
    .sort((a, b) => a.at.getTime() - b.at.getTime())
    .map((entry) => entry.stat);
}
