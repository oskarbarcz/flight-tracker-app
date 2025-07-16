import { AdsbService } from "~/state/api/adsb.service";

const authService = new AdsbService();

export function useAdsbService(): AdsbService {
  return authService;
}
