import {
  Spinner,
  TabItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Tabs,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link, useNavigate, useSearchParams } from "react-router";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { TransparentContainer } from "~/components/shared/Layout/TransparentContainer";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import type { DelayRequest, Flight } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import type { DelayRequestStatusFilter } from "~/state/api/request/delay.request";
import { useDataRefresh } from "~/state/app/context/useDataRefresh";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

const TABS: { status: DelayRequestStatusFilter; label: string }[] = [
  { status: "pending", label: "To review" },
  { status: "settled", label: "Reviewed" },
];

type WorklistEntry = {
  delayRequest: DelayRequest;
  flight: Flight;
};

export default function DelaysWorklistRoute() {
  usePageTitle("Delay reviews");

  const { delayService, flightService } = useApi();
  const { markRefreshed } = useDataRefresh();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status: DelayRequestStatusFilter = searchParams.get("status") === "settled" ? "settled" : "pending";

  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<WorklistEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    delayService
      .list(status)
      .then(async (delayRequests) => {
        const actionable =
          status === "pending" ? delayRequests.filter((request) => request.hasPendingReports) : delayRequests;
        const resolved = await Promise.all(
          actionable.map(async (delayRequest) => ({
            delayRequest,
            flight: await flightService.fetchById(delayRequest.flightId),
          })),
        );
        if (cancelled) return;
        setEntries(resolved);
        markRefreshed();
      })
      .catch((error) => console.error("Failed to load delay reviews", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [delayService, flightService, markRefreshed, status]);

  const activeIndex = TABS.findIndex((tab) => tab.status === status);
  const handleTabChange = (index: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("status", TABS[index].status);
    navigate({ search: newParams.toString() });
  };

  return (
    <>
      <SectionHeader title="Delay reviews" />
      <Tabs key={status} variant="underline" onActiveTabChange={handleTabChange}>
        {TABS.map((tab, i) => (
          <TabItem key={tab.status} active={activeIndex === i} title={tab.label} />
        ))}
      </Tabs>
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner color="indigo" size="xl" />
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-400">
          {status === "pending" ? "No delay reports are awaiting review." : "No reviewed delays yet."}
        </div>
      ) : (
        <TransparentContainer>
          <div className="rounded-2xl overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Flight no</TableHeadCell>
                  <TableHeadCell>Route</TableHeadCell>
                  <TableHeadCell>Departure (UTC)</TableHeadCell>
                  <TableHeadCell>Total delay</TableHeadCell>
                  <TableHeadCell>{status === "pending" ? "Unallocated" : "Allocated"}</TableHeadCell>
                  <TableHeadCell>{status === "pending" ? "Pending" : "Status"}</TableHeadCell>
                  <TableHeadCell>
                    <span className="sr-only">Actions</span>
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {entries.map(({ delayRequest, flight }) => (
                  <TableRow key={delayRequest.id}>
                    <TableCell className="text-base font-bold font-mono text-gray-900 dark:text-white">
                      {flight.flightNumberWithoutSpaces}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {flight.departureAirport.iataCode}
                        <FaArrowRight size="12" className="text-gray-800 dark:text-white" />
                        {flight.destinationAirport.iataCode}
                      </div>
                    </TableCell>
                    <TableCell>
                      <FormattedIcaoDate date={flight.timesheet.scheduled.takeoffTime} />{" "}
                      <FormattedIcaoTime date={flight.timesheet.scheduled.takeoffTime} />
                    </TableCell>
                    <TableCell className="font-mono">{delayRequest.totalDelayMinutes} min</TableCell>
                    {status === "pending" ? (
                      <TableCell
                        className={`font-mono ${
                          delayRequest.unallocatedMinutes > 0 ? "font-semibold text-amber-600 dark:text-amber-500" : ""
                        }`}
                      >
                        {delayRequest.unallocatedMinutes} min
                      </TableCell>
                    ) : (
                      <TableCell className="font-mono">{delayRequest.allocatedMinutes} min</TableCell>
                    )}
                    <TableCell>
                      {status === "pending" ? (
                        <span className="inline-flex min-w-8 justify-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
                          {delayRequest.pendingReports.length}
                        </span>
                      ) : (
                        <span className="inline-flex justify-center rounded-md bg-green-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-green-800 dark:bg-green-900/40 dark:text-green-300">
                          Settled
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        className="block font-bold text-primary-500"
                        to={`/flights/${flight.id}/delays`}
                        viewTransition
                      >
                        {status === "pending" ? "Review" : "View"}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TransparentContainer>
      )}
    </>
  );
}
