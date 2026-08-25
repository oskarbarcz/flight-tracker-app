import React from "react";
import { LuCircleCheck, LuCircleSlash, LuTriangleAlert } from "react-icons/lu";
import { type AdvisoryCheck, AdvisoryOutcome } from "~/features/cargo-manifest/lib/advisories";

type Props = {
  checks: AdvisoryCheck[];
};

const ICONS = {
  [AdvisoryOutcome.Raised]: LuTriangleAlert,
  [AdvisoryOutcome.Clear]: LuCircleCheck,
  [AdvisoryOutcome.NotApplicable]: LuCircleSlash,
};

const TONES = {
  [AdvisoryOutcome.Raised]: "text-amber-700 dark:text-amber-400",
  [AdvisoryOutcome.Clear]: "text-green-700 dark:text-green-400",
  [AdvisoryOutcome.NotApplicable]: "text-gray-400 dark:text-gray-500",
};

const OUTCOME_WORD = {
  [AdvisoryOutcome.Raised]: "Raised",
  [AdvisoryOutcome.Clear]: "Clear",
  [AdvisoryOutcome.NotApplicable]: "Not applicable",
};

export function LoadAdvisories({ checks }: Props) {
  const raised = checks.filter((check) => check.outcome === AdvisoryOutcome.Raised);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {raised.length === 0
          ? "These checks found nothing on this load."
          : `${raised.length} of ${checks.length} checks raised something on this load.`}{" "}
        Each reads the figures the manifest and the hold configuration report. For information only — nothing here stops
        the flight being released or the load going aboard.
      </p>

      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {checks.map((check) => {
          const Icon = ICONS[check.outcome];

          return (
            <li key={check.key} className="flex gap-3 py-3">
              <Icon aria-hidden={true} className={`mt-0.5 size-4 shrink-0 ${TONES[check.outcome]}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{check.label}</span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${TONES[check.outcome]}`}>
                    {OUTCOME_WORD[check.outcome]}
                  </span>
                </div>

                {check.reason !== null && (
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{check.reason}</p>
                )}

                {check.findings.map((finding) => (
                  <div key={finding.headline} className="mt-2">
                    <p className="text-sm text-gray-700 dark:text-gray-200">{finding.headline}</p>
                    <p className="mt-0.5 font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
                      {finding.basis.join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
