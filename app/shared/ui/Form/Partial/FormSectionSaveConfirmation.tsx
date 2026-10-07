import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export function FormSectionSaveConfirmation() {
  return (
    <div className="flex items-center gap-1 px-4 text-green-700 dark:text-green-400 font-bold">
      Saved <FaCheckCircle className="inline" />
    </div>
  );
}
