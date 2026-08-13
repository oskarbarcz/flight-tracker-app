import { Badge } from "flowbite-react";
import React, { useId, useState } from "react";
import { LuArrowRight, LuChevronDown } from "react-icons/lu";
import {
  decodeQcode,
  formatRawNotam,
  type Notam,
  NotamSeverity,
  notamSeverity,
  toNotamSegments,
} from "~/features/notam";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  notam: Notam;
};

function severityBadgeColor(severity: NotamSeverity): string {
  switch (severity) {
    case NotamSeverity.OutOfService:
      return "failure";
    case NotamSeverity.Limited:
      return "warning";
    case NotamSeverity.Advisory:
      return "gray";
  }
}

export function NotamRecord({ notam }: Props) {
  const [showRaw, setShowRaw] = useState(false);
  const rawId = useId();

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{notam.notamId}</span>
          <span aria-hidden className="text-gray-400 dark:text-gray-600">
            ·
          </span>
          <FieldLabel className="truncate">{notam.nrc}</FieldLabel>
        </div>
        <Badge color={severityBadgeColor(notamSeverity(notam.qcode))} size="xs" className="shrink-0">
          {decodeQcode(notam.qcodeSubject, notam.qcodeStatus)}
        </Badge>
      </header>

      <p className="break-words px-3 py-2 font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200">
        {toNotamSegments(notam.html, notam.text).map((segment) =>
          segment.emphasized ? (
            <strong key={segment.offset} className="font-bold text-gray-900 dark:text-white">
              {segment.text}
            </strong>
          ) : (
            <React.Fragment key={segment.offset}>{segment.text}</React.Fragment>
          ),
        )}
      </p>

      <footer className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-gray-200 px-3 py-1.5 dark:border-gray-800">
        <NotamValidity notam={notam} />
        <button
          type="button"
          onClick={() => setShowRaw(!showRaw)}
          aria-expanded={showRaw}
          aria-controls={rawId}
          aria-label={`Raw NOTAM ${notam.notamId}`}
          className="flex cursor-pointer items-center gap-1 rounded-md px-1 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 transition-colors hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400"
        >
          Raw
          <LuChevronDown
            aria-hidden
            className={`size-3 transition-transform duration-200 motion-reduce:transition-none ${showRaw ? "rotate-180" : ""}`}
          />
        </button>
      </footer>

      {showRaw && (
        <pre
          id={rawId}
          className="animate-in fade-in slide-in-from-top-1 overflow-x-auto border-t border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs leading-relaxed text-gray-700 duration-200 motion-reduce:animate-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
        >
          {formatRawNotam(notam.raw)}
        </pre>
      )}
    </article>
  );
}

function NotamValidity({ notam }: Props) {
  const effective = new Date(notam.dateEffective);
  const expire = notam.dateExpire ? new Date(notam.dateExpire) : null;
  const amended = new Date(notam.dateModified);
  const isAmended = amended.getTime() > new Date(notam.dateCreated).getTime();

  return (
    <span className="flex flex-wrap items-center gap-x-1.5 text-xs text-gray-500 dark:text-gray-400">
      <IcaoTimestamp date={effective} />
      <LuArrowRight aria-hidden className="size-3 shrink-0" />
      {expire ? (
        <IcaoTimestamp date={expire} />
      ) : (
        <span className="font-mono font-bold text-gray-700 dark:text-gray-300">PERM</span>
      )}
      {isAmended && (
        <>
          <span aria-hidden>·</span>
          <span>
            amended <IcaoTimestamp date={amended} />
          </span>
        </>
      )}
    </span>
  );
}

function IcaoTimestamp({ date }: { date: Date }) {
  return (
    <span className="text-gray-700 dark:text-gray-300">
      <FormattedIcaoDate date={date} /> <FormattedIcaoTime date={date} />
    </span>
  );
}
