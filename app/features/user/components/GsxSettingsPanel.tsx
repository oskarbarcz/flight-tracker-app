import { FaCircleExclamation } from "react-icons/fa6";
import { GsxAutomationSetting } from "~/features/user/components/GsxAutomationSetting";
import { GsxSwitch } from "~/features/user/components/GsxSwitch";
import type { GsxSettingsControl } from "~/features/user/hooks/useGsxSettings";
import { gsxAutomations, gsxIntegration, gsxLoadFailureMessage } from "~/features/user/lib/gsxSettings";
import { RecordNote } from "~/shared/ui/Record/RecordNote";
import { RecordRow } from "~/shared/ui/Record/RecordRow";

type Props = {
  gsx: GsxSettingsControl;
};

function FailureMessage({ children }: { children: string }) {
  return (
    <p
      role="alert"
      className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-pretty text-sm text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300"
    >
      <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function GsxSettingsPanel({ gsx }: Props) {
  const { settings, loadFailed, saveFailure, change } = gsx;

  if (loadFailed) {
    return (
      <RecordRow label={gsxIntegration.label}>
        <FailureMessage>{gsxLoadFailureMessage}</FailureMessage>
      </RecordRow>
    );
  }

  const integrationEnabled = settings?.integrationEnabled ?? false;
  const note =
    settings === null || integrationEnabled
      ? gsxIntegration.note
      : `${gsxIntegration.note} ${gsxIntegration.hintWhenOff}`;

  return (
    <RecordRow
      label={gsxIntegration.label}
      keepActionBeside
      action={
        <GsxSwitch
          label={gsxIntegration.label}
          checked={settings === null ? null : integrationEnabled}
          sizing="md"
          onChange={(enabled) => change("integrationEnabled", enabled)}
        />
      }
      detail={
        <div className="@container">
          <div className="grid gap-x-3 gap-y-5 @md:grid-cols-2">
            {gsxAutomations.map(({ setting, flow, label, description }) => (
              <GsxAutomationSetting
                key={setting}
                flow={flow}
                label={label}
                description={description}
                checked={settings === null ? null : settings[setting]}
                integrationEnabled={integrationEnabled}
                onChange={(enabled) => change(setting, enabled)}
              />
            ))}
          </div>
        </div>
      }
    >
      <RecordNote>{note}</RecordNote>

      {saveFailure !== null && <FailureMessage>{saveFailure}</FailureMessage>}
    </RecordRow>
  );
}
