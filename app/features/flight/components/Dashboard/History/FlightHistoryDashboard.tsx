import React, { useState } from "react";
import { FlightSource } from "~/features/flight";
import { FlightHeroCard } from "~/features/flight/components/Dashboard/History/Box/FlightHeroCard";
import { HistoryDataTab, HistoryDataTabs } from "~/features/flight/components/Dashboard/History/Tabs/HistoryDataTabs";
import { HistoryDelaysTab } from "~/features/flight/components/Dashboard/History/Tabs/Tab/HistoryDelaysTab";
import { HistoryEventsTab } from "~/features/flight/components/Dashboard/History/Tabs/Tab/HistoryEventsTab";
import { HistoryMapTab } from "~/features/flight/components/Dashboard/History/Tabs/Tab/HistoryMapTab";
import { HistoryOfpTab } from "~/features/flight/components/Dashboard/History/Tabs/Tab/HistoryOfpTab";
import { HistoryOverviewTab } from "~/features/flight/components/Dashboard/History/Tabs/Tab/HistoryOverviewTab";
import { useHistoryFlight } from "~/features/flight/hooks/useHistoryFlight";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export function FlightHistoryDashboard() {
  const { flight, loading } = useHistoryFlight();
  const [tab, setTab] = useState<HistoryDataTab>(HistoryDataTab.Overview);

  usePageTitle(flight ? `Flight history · ${flight.flightNumber}` : "Flight history");

  if (loading || !flight) {
    return <div className="py-16 text-center text-gray-500">Loading…</div>;
  }

  const isSimbriefAvailable = flight.source === FlightSource.SimBrief;

  return (
    <>
      <FlightHeroCard flight={flight} />

      <div className="mt-4">
        <HistoryDataTabs tab={tab} setTab={setTab} isSimbriefAvailable={isSimbriefAvailable} />
      </div>

      {tab === HistoryDataTab.Overview && <HistoryOverviewTab />}
      {tab === HistoryDataTab.Events && <HistoryEventsTab />}
      {tab === HistoryDataTab.Map && <HistoryMapTab />}
      {tab === HistoryDataTab.OperationalFlightPlan && <HistoryOfpTab />}
      {tab === HistoryDataTab.Delays && <HistoryDelaysTab flightId={flight.id} />}
    </>
  );
}
