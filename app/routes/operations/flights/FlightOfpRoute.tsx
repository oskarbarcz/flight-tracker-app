"use client";

import type { Route } from ".react-router/types/app/routes/operations/flights/+types/FlightOfpRoute";
import React from "react";
import { FaArrowUpRightFromSquare, FaFileLines, FaPlaneUp } from "react-icons/fa6";
import { HiInformationCircle } from "react-icons/hi";
import { useLoaderData } from "react-router";
import type { FlightOfp } from "~/models";
import { FlightService } from "~/state/api/flight.service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  try {
    const ofp = await new FlightService().fetchOfpByFlightId(params.id);
    return { ofp };
  } catch {
    return { ofp: null };
  }
}

export default function FlightOfpRoute() {
  const { ofp } = useLoaderData<typeof clientLoader>();

  if (!ofp) {
    return (
      <div className="mt-3">
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/40 px-4 py-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
          <HiInformationCircle className="size-5 shrink-0 text-gray-400" />
          <span>No OFP is available for this flight.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 grid grid-cols-1 gap-3">
      <DocumentCard ofp={ofp} />
      <RunwayAnalysisCard ofp={ofp} />
    </div>
  );
}

function DocumentCard({ ofp }: { ofp: FlightOfp }) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="h-1 bg-linear-to-r from-indigo-500 via-indigo-400 to-indigo-300 dark:from-indigo-600 dark:via-indigo-500 dark:to-indigo-400" />

      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-indigo-500">
            <FaFileLines size={13} />
            <span className="text-xs font-bold uppercase tracking-widest">Operational Flight Plan</span>
          </div>
          {ofp.ofpDocumentUrl && (
            <a
              href={ofp.ofpDocumentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-500 hover:underline"
            >
              Open PDF
              <FaArrowUpRightFromSquare size={11} />
            </a>
          )}
        </div>

        <OfpHtml html={ofp.ofpContent} />
      </div>
    </section>
  );
}

function RunwayAnalysisCard({ ofp }: { ofp: FlightOfp }) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="h-1 bg-linear-to-r from-indigo-500 via-indigo-400 to-indigo-300 dark:from-indigo-600 dark:via-indigo-500 dark:to-indigo-400" />

      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2 text-indigo-500">
          <FaPlaneUp size={13} />
          <span className="text-xs font-bold uppercase tracking-widest">Runway Analysis</span>
        </div>

        <OfpHtml html={ofp.runwayAnalysis} />
      </div>
    </section>
  );
}

function OfpHtml({ html }: { html: string }) {
  return (
    <div
      className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50/60 p-4 font-mono text-xs leading-relaxed text-gray-800 dark:border-gray-800 dark:bg-gray-950/60 dark:text-gray-200 [&_a]:text-indigo-500 [&_a:hover]:underline [&_pre]:whitespace-pre-wrap [&_table]:w-full"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted HTML payload from the flight tracker API
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
