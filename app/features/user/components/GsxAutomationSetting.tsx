import { useId } from "react";
import { GsxPassengerFlowDrawing } from "~/features/user/components/GsxPassengerFlowDrawing";
import { GsxSwitch } from "~/features/user/components/GsxSwitch";
import type { GsxPassengerFlow } from "~/features/user/lib/gsxSettings";

type Props = {
  flow: GsxPassengerFlow;
  label: string;
  description: string;
  checked: boolean | null;
  integrationEnabled: boolean;
  onChange: (enabled: boolean) => void;
};

export function GsxAutomationSetting({ flow, label, description, checked, integrationEnabled, onChange }: Props) {
  const descriptionId = useId();

  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/40">
        <GsxPassengerFlowDrawing flow={flow} active={integrationEnabled && checked === true} />
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
          <p id={descriptionId} className="text-pretty text-xs text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="shrink-0">
          <GsxSwitch
            label={label}
            describedBy={descriptionId}
            checked={checked}
            disabled={!integrationEnabled}
            sizing="sm"
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
