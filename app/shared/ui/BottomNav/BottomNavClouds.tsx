import React from "react";

type Cloud = {
  id: string;
  depth: "far" | "mid" | "near";
  width: number;
  top: string;
  left: string;
};

const CLOUDS: Cloud[] = [
  { id: "crest", depth: "far", width: 20, top: "5%", left: "48%" },
  { id: "port", depth: "mid", width: 14, top: "17%", left: "6%" },
  { id: "lead", depth: "near", width: 26, top: "31%", left: "60%" },
  { id: "trail", depth: "mid", width: 16, top: "40%", left: "-5%" },
];

export function BottomNavClouds() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      {CLOUDS.map((cloud) => (
        <svg
          key={cloud.id}
          aria-hidden="true"
          focusable="false"
          className={`nav-cloud nav-cloud--${cloud.depth}`}
          style={{ top: cloud.top, left: cloud.left, width: `${cloud.width}px` }}
          viewBox="0 0 32 14"
          fill="currentColor"
        >
          <circle cx="10" cy="8" r="6" />
          <circle cx="19" cy="6.5" r="6.5" />
          <circle cx="25.5" cy="9" r="4.5" />
          <rect x="4" y="8" width="24" height="6" rx="3" />
        </svg>
      ))}
    </span>
  );
}
