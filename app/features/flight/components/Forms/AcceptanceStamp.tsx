import React from "react";
import { dateToIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { dateToIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";

type Props = {
  signedAt: Date;
  licenceId: string | null;
  animate: boolean;
};

export function AcceptanceStamp({ signedAt, licenceId, animate }: Props) {
  return (
    <span
      className={`acceptance-stamp ${animate ? "acceptance-stamp--press" : ""}`}
      style={{ filter: "url(#stamp-ink-bleed)" }}
    >
      <span className="acceptance-stamp__plate">
        <span className="acceptance-stamp__title">Accepted</span>
        <span className="acceptance-stamp__rule" />
        {licenceId !== null && <span className="acceptance-stamp__line">{licenceId}</span>}
        <span className="acceptance-stamp__line">
          {dateToIcaoDate(signedAt)} {dateToIcaoTime(signedAt)}Z
        </span>
      </span>
    </span>
  );
}

export function StampInkBleedFilter() {
  return (
    <svg aria-hidden={true} width="0" height="0" className="absolute">
      <title>Stamp ink bleed</title>
      <filter id="stamp-ink-bleed" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03 0.11" numOctaves="3" seed="11" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.1" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
