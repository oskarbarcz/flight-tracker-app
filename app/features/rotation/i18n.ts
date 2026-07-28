import { RotationStatus } from "~/features/rotation/model";

export function translateRotationStatus(status: RotationStatus): string {
  const labels = {
    [RotationStatus.Draft]: "Draft",
    [RotationStatus.Ready]: "Ready",
    [RotationStatus.InProgress]: "In progress",
    [RotationStatus.Finished]: "Finished",
    [RotationStatus.Canceled]: "Canceled",
  };

  return labels[status];
}
