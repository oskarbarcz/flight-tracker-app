import React from "react";
import { MdVerified } from "react-icons/md";

export function VerifiedOperatorBadge() {
  return (
    <span className="text-green-500 inline-flex items-center gap-1 py-1.5 px-3 text-sm">
      <MdVerified size={19} className="inline" />
      Verified operator
    </span>
  );
}
