import { SkyLinkService } from "~/state/api/skylink.service";

const skyLinkService = new SkyLinkService();

export function useSkyLinkService(): SkyLinkService {
  return skyLinkService;
}
