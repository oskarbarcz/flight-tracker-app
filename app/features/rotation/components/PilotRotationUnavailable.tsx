import React from "react";
import { FaArrowLeft, FaArrowsSpin } from "react-icons/fa6";
import { Link } from "react-router";
import { TilePlaceholder } from "~/shared/ui/Layout/TilePlaceholder";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

type Props = {
  hint: string;
};

export function PilotRotationUnavailable({ hint }: Props) {
  return (
    <>
      <div className="mb-3">
        <Link
          to="/rotations"
          viewTransition
          className="inline-flex items-center gap-2 rounded text-sm font-semibold text-gray-500 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaArrowLeft size={12} aria-hidden={true} />
          Rotations
        </Link>
      </div>
      <SectionHeader title="Rotation" />
      <TilePlaceholder icon={FaArrowsSpin} hint={hint} />
    </>
  );
}
