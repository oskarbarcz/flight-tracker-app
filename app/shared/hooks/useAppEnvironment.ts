import { useMemo } from "react";

type AppConfig = {
  discordInvitationHash: string;
  flightTrackerHost: string;
  adsbApiHost: string;
  isProduction: boolean;
  isDebug: boolean;
  appVersion: string;
};

export function useAppEnvironment(): AppConfig {
  return useMemo<AppConfig>(() => {
    const environment = import.meta.env.VITE_NODE_ENV as string;

    return {
      discordInvitationHash: import.meta.env.VITE_DISCORD_INVITATION_HASH as string,
      flightTrackerHost: import.meta.env.VITE_FLIGHT_TRACKER_API_HOST as string,
      adsbApiHost: import.meta.env.VITE_ADSB_API_HOST as string,
      isProduction: environment === "production",
      isDebug: environment === "development",
      appVersion: import.meta.env.PACKAGE_VERSION,
    };
  }, []);
}
