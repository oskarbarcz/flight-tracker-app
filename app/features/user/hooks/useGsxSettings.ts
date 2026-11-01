import { useEffect, useRef, useState } from "react";
import { describeMessageSettingSaveFailure } from "~/features/auth/lib/describeDiscordFailure";
import type { GsxSetting } from "~/features/user/lib/gsxSettings";
import type { GsxSettingsResponse } from "~/features/user/request";
import { useApi } from "~/shared/api/useApi";

export type GsxSettingsControl = {
  settings: GsxSettingsResponse | null;
  loadFailed: boolean;
  saveFailure: string | null;
  change: (setting: GsxSetting, enabled: boolean) => void;
};

export function useGsxSettings(): GsxSettingsControl {
  const { userService } = useApi();
  const [settings, setSettings] = useState<GsxSettingsResponse | null>(null);
  const [loadFailed, setLoadFailed] = useState<boolean>(false);
  const [saveFailure, setSaveFailure] = useState<string | null>(null);
  const confirmed = useRef<GsxSettingsResponse | null>(null);
  const saves = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;

    userService
      .fetchGsxSettings()
      .then((current) => {
        if (active) {
          confirmed.current = current;
          setSettings(current);
        }
      })
      .catch(() => {
        if (active) {
          setLoadFailed(true);
        }
      });

    return () => {
      active = false;
    };
  }, [userService]);

  function change(setting: GsxSetting, enabled: boolean) {
    setSettings((current) => current && { ...current, [setting]: enabled });
    setSaveFailure(null);

    saves.current = saves.current
      .then(() => userService.updateGsxSettings({ [setting]: enabled }))
      .then((saved) => {
        confirmed.current = saved;
      })
      .catch((reason) => {
        setSettings((current) => current && confirmed.current && { ...current, [setting]: confirmed.current[setting] });
        setSaveFailure(describeMessageSettingSaveFailure(reason));
      });
  }

  return { settings, loadFailed, saveFailure, change };
}
