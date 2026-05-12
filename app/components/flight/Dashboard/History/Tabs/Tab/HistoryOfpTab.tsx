import React from "react";
import { FaFileLines } from "react-icons/fa6";
import { useHistoryFlight } from "~/state/api/context/useHistoryFlight";
import useFlightOfp from "~/state/api/hooks/useFlightOfp";

function unescapeOFP(html: string): string {
  return html
    .replace(/\\n/g, "<br />")
    .replace(/\\toHuman/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
    .replace(/\\r/g, "");
}

export function HistoryOfpTab() {
  const { flight } = useHistoryFlight();
  const { ofp, loading } = useFlightOfp(flight?.id ?? null);

  if (!flight) return null;

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <header className="flex items-center gap-2 border-b border-gray-100 px-5 py-3 text-indigo-500 dark:border-gray-800">
        <FaFileLines size={13} />
        <span className="text-xs font-bold uppercase tracking-widest">Operational flight plan</span>
      </header>
      <div className="max-h-[40rem] overflow-auto p-5">
        {loading && <p className="text-sm text-gray-500">Loading OFP…</p>}
        {!loading && !ofp && <p className="text-sm text-gray-500">No OFP available.</p>}
        {ofp && (
          <div
            className="font-mono text-xs text-gray-700 dark:text-gray-300"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: we trust and verify SimBrief data
            dangerouslySetInnerHTML={{ __html: unescapeOFP(ofp.ofpContent) || "" }}
          />
        )}
      </div>
    </section>
  );
}
