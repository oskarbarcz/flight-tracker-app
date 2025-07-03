import { RotationService } from "~/state/api/rotation.service";

const rotationService = new RotationService();

export function useRotationService(): RotationService {
  return rotationService;
}
