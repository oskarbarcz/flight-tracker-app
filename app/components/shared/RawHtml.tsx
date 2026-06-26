import React from "react";

type Props = {
  html: string;
  className?: string;
};

export function RawHtml({ html, className }: Props) {
  return (
    <div
      className={className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted server-sourced HTML (SimBrief OFP / flight-tracker API)
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
