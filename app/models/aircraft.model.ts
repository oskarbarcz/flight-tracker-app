import type { Airframe } from "~/models/airframe.model";

export type Aircraft = {
  id: string;
  airframe: Airframe;
  registration: string;
  selcal: string;
  livery: string;
};
