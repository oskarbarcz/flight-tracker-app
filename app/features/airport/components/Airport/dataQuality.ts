import type { IconType } from "react-icons";
import { LuCircleCheck, LuCircleDashed, LuStar } from "react-icons/lu";
import { DataQuality } from "~/features/airport/model";

export const DATA_QUALITY_ICON: Record<DataQuality, IconType> = {
  [DataQuality.Low]: LuCircleDashed,
  [DataQuality.High]: LuCircleCheck,
  [DataQuality.Flagship]: LuStar,
};

export const DATA_QUALITY_TONE: Record<DataQuality, string> = {
  [DataQuality.Low]: "text-amber-500",
  [DataQuality.High]: "text-sky-500",
  [DataQuality.Flagship]: "text-indigo-500",
};

export const DATA_QUALITY_CHIP_LABEL: Record<DataQuality, string> = {
  [DataQuality.Low]: "low quality",
  [DataQuality.High]: "high quality",
  [DataQuality.Flagship]: "flagship",
};
