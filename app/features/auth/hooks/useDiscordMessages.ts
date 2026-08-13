import { useEffect, useState } from "react";
import { describeMessageSettingSaveFailure } from "~/features/auth/lib/describeDiscordFailure";
import type { DiscordMessageSetting } from "~/features/auth/lib/discordFeatures";
import type { DiscordSettingsResponse } from "~/features/user/request";
import { useApi } from "~/shared/api/useApi";
import { getDiscordClientId } from "~/shared/lib/getDiscordClientId";

export type DiscordMessages = {
  settings: DiscordSettingsResponse | null;
  pending: boolean;
  failure: string | null;
  change: (settings: DiscordMessageSetting[], enabled: boolean) => void;
};

export function useDiscordMessages(): DiscordMessages {
  const { userService } = useApi();
  const [settings, setSettings] = useState<DiscordSettingsResponse | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    if (getDiscordClientId() === null) {
      return;
    }

    let active = true;

    userService
      .fetchDiscordSettings()
      .then((current) => {
        if (active) {
          setSettings(current);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [userService]);

  function change(changed: DiscordMessageSetting[], enabled: boolean) {
    if (pending || settings === null) {
      return;
    }

    const previous = settings;
    const patch = Object.fromEntries(changed.map((setting) => [setting, enabled]));

    setSettings({ ...previous, ...patch });
    setPending(true);
    setFailure(null);

    userService
      .updateDiscordSettings(patch)
      .then(setSettings)
      .catch((reason) => {
        setSettings(previous);
        setFailure(describeMessageSettingSaveFailure(reason));
      })
      .finally(() => setPending(false));
  }

  return { settings, pending, failure, change };
}
