import type React from "react";

type Props = {
  label: string;
  description: string;
  control: React.ReactNode;
  footer?: React.ReactNode;
};

export function DiscordFeatureRow({ label, description, control, footer }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
          <p className="text-pretty text-xs text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <div className="mt-0.5 shrink-0">{control}</div>
      </div>
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}
