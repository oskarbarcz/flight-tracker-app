import React from "react";
import { FaChartColumn } from "react-icons/fa6";
import { ActivityPanel } from "~/features/stats/components/Activity/ActivityPanel";
import { HeatmapPanel } from "~/features/stats/components/Heatmap/HeatmapPanel";
import { useStats } from "~/features/stats/hooks/useStats";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { Container } from "~/shared/ui/Layout/Container";
import { TilePlaceholder } from "~/shared/ui/Layout/TilePlaceholder";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

export default function PilotStatsRoute() {
  usePageTitle("Statistics");

  const stats = useStats();

  return (
    <>
      <SectionHeader title="Statistics" />
      {stats.loading ? (
        <Container padding="normal">
          <TilePlaceholder icon={FaChartColumn} hint="Reading your logbook." />
        </Container>
      ) : stats.failed ? (
        <Container padding="normal">
          <TilePlaceholder icon={FaChartColumn} hint="Your statistics could not be loaded. Try again in a moment." />
        </Container>
      ) : stats.hasFlown ? (
        <div className="flex flex-col gap-4">
          <HeatmapPanel stats={stats} />
          <ActivityPanel stats={stats} />
        </div>
      ) : (
        <Container padding="normal">
          <TilePlaceholder icon={FaChartColumn} hint="Close your first flight and your statistics will appear here." />
        </Container>
      )}
    </>
  );
}
