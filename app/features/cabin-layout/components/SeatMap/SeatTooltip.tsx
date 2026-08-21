import React, { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CONDITION_LABELS, seatCondition } from "~/features/cabin-layout/lib/seatAppearance";
import { type CabinSeat, CommentSentiment } from "~/features/cabin-layout/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  seat: CabinSeat;
  x: number;
  y: number;
  below: boolean;
};

const FALLBACK_HALF_WIDTH = 70;
const VIEWPORT_MARGIN = 8;
const ARROW_INSET = 12;

const SENTIMENT_GLYPHS: Record<CommentSentiment, string> = {
  [CommentSentiment.Good]: "+",
  [CommentSentiment.Neutral]: "·",
  [CommentSentiment.Bad]: "−",
};

const SENTIMENT_COLOURS: Record<CommentSentiment, string> = {
  [CommentSentiment.Good]: "text-green-300",
  [CommentSentiment.Neutral]: "text-gray-300",
  [CommentSentiment.Bad]: "text-red-300",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function SeatTooltip({ seat, x, y, below }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [halfWidth, setHalfWidth] = useState(FALLBACK_HALF_WIDTH);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (card !== null) {
      setHalfWidth(card.getBoundingClientRect().width / 2);
    }
  }, []);

  const lower = halfWidth + VIEWPORT_MARGIN;
  const upper = Math.max(window.innerWidth - halfWidth - VIEWPORT_MARGIN, lower);
  const anchor = clamp(x, lower, upper);
  const arrowLimit = Math.max(0, halfWidth - ARROW_INSET);
  const arrowOffset = clamp(x - anchor, -arrowLimit, arrowLimit);
  const condition = seatCondition(seat);

  return createPortal(
    <div
      role="tooltip"
      style={{ transform: `translate3d(${anchor}px, ${y}px, 0) translate(-50%, ${below ? "0" : "-100%"})` }}
      className={`pointer-events-none fixed left-0 top-0 z-50 ${below ? "pt-2" : "pb-2"}`}
    >
      <div
        ref={cardRef}
        className={`relative animate-in fade-in zoom-in-95 rounded-lg bg-gray-900 px-3 py-2 shadow-lg duration-[90ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none dark:bg-gray-700 ${below ? "origin-top" : "origin-bottom"}`}
      >
        <span className="block whitespace-nowrap text-xs text-gray-300">
          <span className="font-mono font-bold text-white">{seat.designator}</span>
          {`, ${toHuman.cabinLayout.cabinClass(seat.cabin)}`}
        </span>

        <dl className="mt-1 grid grid-cols-[auto_auto] gap-x-3 text-xs">
          <dt className="text-gray-400">Rating</dt>
          <dd className="whitespace-nowrap text-end text-white">
            {seat.rating ? toHuman.cabinLayout.seatRating(seat.rating) : "Not rated"}
          </dd>
          <dt className="text-gray-400">Window</dt>
          <dd className="whitespace-nowrap text-end text-white">
            {seat.windowStatus ? toHuman.cabinLayout.windowStatus(seat.windowStatus) : "Not reported"}
          </dd>
          {condition !== null && (
            <>
              <dt className="text-gray-400">Availability</dt>
              <dd className="whitespace-nowrap text-end text-white">{CONDITION_LABELS[condition]}</dd>
            </>
          )}
          {seat.reversed && (
            <>
              <dt className="text-gray-400">Facing</dt>
              <dd className="whitespace-nowrap text-end text-white">Rearward</dd>
            </>
          )}
        </dl>

        {seat.comments.length > 0 && (
          <ul className="mt-1.5 max-w-64 space-y-1 border-t border-white/10 pt-1.5 text-xs">
            {seat.comments.map((comment) => (
              <li key={comment.slug} className="flex gap-1.5">
                <span
                  aria-hidden={true}
                  className={`mt-px w-2 shrink-0 text-center font-mono font-bold ${SENTIMENT_COLOURS[comment.sentiment]}`}
                >
                  {SENTIMENT_GLYPHS[comment.sentiment]}
                </span>
                <span className="text-gray-200">
                  <span className="sr-only">{`${toHuman.cabinLayout.commentSentiment(comment.sentiment)}: `}</span>
                  {comment.comment}
                  {comment.severity !== null && (
                    <span className="ml-1 whitespace-nowrap rounded-sm bg-white/10 px-1 py-px text-[10px] uppercase tracking-wide text-gray-300">
                      {toHuman.cabinLayout.commentSeverity(comment.severity)}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}

        <span
          aria-hidden={true}
          style={{ left: `calc(50% + ${arrowOffset}px)` }}
          className={`absolute size-2 -translate-x-1/2 rotate-45 rounded-[1px] bg-gray-900 dark:bg-gray-700 ${below ? "-top-1" : "-bottom-1"}`}
        />
      </div>
    </div>,
    document.body,
  );
}
