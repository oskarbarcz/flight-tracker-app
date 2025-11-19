"use client";

import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function FormSectionSaveConfirmation() {
  return (
    <div className="flex items-center gap-1 px-4 text-green-500 font-bold">
      Saved <FaCheckCircle className="inline" />
    </div>
  );
}
