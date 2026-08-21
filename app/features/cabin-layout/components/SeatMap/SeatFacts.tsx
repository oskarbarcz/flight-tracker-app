import React from "react";
import { TooltipRow } from "~/features/cabin-layout/components/SeatMap/TooltipRow";
import { CONDITION_LABELS, seatCondition } from "~/features/cabin-layout/lib/seatAppearance";
import { type CabinSeat, CommentSentiment } from "~/features/cabin-layout/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  seat: CabinSeat;
};

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

export function SeatFacts({ seat }: Props) {
  const condition = seatCondition(seat);

  return (
    <>
      <dl className="mt-1 grid grid-cols-[auto_auto] gap-x-3 text-xs">
        <TooltipRow label="Rating" value={seat.rating ? toHuman.cabinLayout.seatRating(seat.rating) : "Not rated"} />
        <TooltipRow
          label="Window"
          value={seat.windowStatus ? toHuman.cabinLayout.windowStatus(seat.windowStatus) : "Not reported"}
        />
        {condition !== null && <TooltipRow label="Availability" value={CONDITION_LABELS[condition]} />}
        {seat.reversed && <TooltipRow label="Facing" value="Rearward" />}
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
    </>
  );
}
