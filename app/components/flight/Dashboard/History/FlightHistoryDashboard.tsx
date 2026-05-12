import React, { useState } from "react";
import { FlightHeroCard } from "~/components/flight/Dashboard/History/Box/FlightHeroCard";
import { HistoryDataTab, HistoryDataTabs } from "~/components/flight/Dashboard/History/Tabs/HistoryDataTabs";
import { HistoryEventsTab } from "~/components/flight/Dashboard/History/Tabs/Tab/HistoryEventsTab";
import { HistoryMapTab } from "~/components/flight/Dashboard/History/Tabs/Tab/HistoryMapTab";
import { HistoryOfpTab } from "~/components/flight/Dashboard/History/Tabs/Tab/HistoryOfpTab";
import { HistoryOverviewTab } from "~/components/flight/Dashboard/History/Tabs/Tab/HistoryOverviewTab";
import { FlightSource } from "~/models";
import { useHistoryFlight } from "~/state/api/context/useHistoryFlight";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

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
    </>
  );
}
