import { FaDownload } from "react-icons/fa6";
import { HiInformationCircle, HiX } from "react-icons/hi";
import type { Flight } from "~/models";
import { RawHtml } from "~/shared/ui/RawHtml";
import { usePublicFlightOfp } from "~/state/api/hooks/usePublicFlightOfp";

type Props = {
  flight: Flight;
  onClose: () => void;
};

function unescapeOfp(html: string): string {
  return html.replace(/\\n/g, "<br />").replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\\r/g, "");
}

export function FlightPlanOverlay({ flight, onClose }: Props) {
  const { ofp, loading, error } = usePublicFlightOfp(flight.id);
  const downloadUrl = ofp?.ofpDocumentUrl;

  return (
    <section className="bg-gray-100 pointer-events-auto dark:bg-gray-950 text-gray-800 dark:text-gray-300 p-6 w-full sm:w-lg rounded-xl">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Flight plan</h2>
          <span className="mt-1 block font-mono text-lg font-bold text-gray-900 dark:text-white">
            {flight.flightNumberWithoutSpaces}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <a
            href={downloadUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!downloadUrl}
            tabIndex={downloadUrl ? 0 : -1}
            className={`inline-flex items-center gap-1.5 rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-indigo-600 ${
              downloadUrl ? "cursor-pointer" : "pointer-events-none opacity-40"
            }`}
          >
            <FaDownload size={12} />
            SimBrief OFP (PDF)
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close flight plan"
            className="cursor-pointer p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <HiX size={20} />
          </button>
        </div>
      </header>

      {loading && <p className="text-sm text-gray-500">Loading flight plan…</p>}

      {!loading && (error || !ofp) && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          <HiInformationCircle className="size-5 shrink-0 text-gray-400" />
          <span>No flight plan is available for this flight.</span>
        </div>
      )}

      {!loading && ofp && (
        <div className="max-h-[24rem] overflow-auto rounded-lg bg-white p-4 dark:bg-gray-900">
          <RawHtml
            className="font-mono text-[11px] leading-relaxed text-gray-700 dark:text-gray-300"
            html={unescapeOfp(ofp.ofpContent) || ""}
          />
        </div>
      )}
    </section>
  );
}
