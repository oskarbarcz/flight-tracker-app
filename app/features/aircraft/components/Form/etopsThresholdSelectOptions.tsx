import React from "react";
import { HiOutlineClock } from "react-icons/hi";
import { etopsThresholdMinutesOptions, notEtopsCertified } from "~/features/aircraft/schema";
import type { AdvancedSelectOption } from "~/shared/ui/Form/AdvancedSelect/AdvancedSelect";
import { OptionAvatarFrame } from "~/shared/ui/Form/AdvancedSelect/OptionAvatarFrame";

function clockAvatar() {
  return (
    <OptionAvatarFrame>
      <HiOutlineClock className="size-5 text-gray-500 dark:text-gray-400" />
    </OptionAvatarFrame>
  );
}

export const etopsThresholdSelectOptions: AdvancedSelectOption[] = [
  {
    value: notEtopsCertified,
    keywords: ["not etops certified", "none"],
    avatar: clockAvatar(),
    title: "Not ETOPS-certified",
  },
  ...etopsThresholdMinutesOptions.map((minutes) => ({
    value: minutes.toString(),
    keywords: [minutes.toString(), `${minutes} minutes`],
    avatar: clockAvatar(),
    title: `${minutes} minutes`,
  })),
];
