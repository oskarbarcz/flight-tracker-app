import { NotocStage } from "~/features/notoc/model";

const stageLabels: Record<NotocStage, string> = {
  [NotocStage.Preliminary]: "Preliminary",
  [NotocStage.Final]: "Final",
};

export function translateNotocStage(stage: NotocStage): string {
  return stageLabels[stage];
}
