import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React, { useMemo } from "react";
import { CONDITION_LABELS, seatCondition } from "~/features/cabin-layout/lib/seatAppearance";
import { orderedSeats } from "~/features/cabin-layout/lib/seatOrder";
import type { CabinSeat, CabinSeatMapDeck } from "~/features/cabin-layout/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  deck: CabinSeatMapDeck;
  id: string;
  query: string;
};

function availability(seat: CabinSeat): string {
  const condition = seatCondition(seat);
  const facing = seat.reversed ? "rearward facing" : null;
  const parts = [condition === null ? "Bookable" : CONDITION_LABELS[condition], facing];

  return parts.filter((part) => part !== null).join(", ");
}

export function SeatTable({ deck, id, query }: Props) {
  const wanted = query.trim().toUpperCase();
  const seats = useMemo(
    () => orderedSeats(deck).filter((seat) => seat.designator.toUpperCase().includes(wanted)),
    [deck, wanted],
  );

  if (seats.length === 0) {
    return (
      <p
        id={id}
        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
      >
        {`No seat on this deck is numbered like "${query.trim()}".`}
      </p>
    );
  }

  return renderTable(seats, id);
}

function renderTable(seats: CabinSeat[], id: string) {
  return (
    <div id={id} className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Seat</TableHeadCell>
              <TableHeadCell>Cabin</TableHeadCell>
              <TableHeadCell>Rating</TableHeadCell>
              <TableHeadCell>Window</TableHeadCell>
              <TableHeadCell>Availability</TableHeadCell>
              <TableHeadCell>Comments</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {seats.map((seat) => (
              <TableRow key={seat.designator}>
                <TableCell className="whitespace-nowrap font-mono font-bold text-gray-900 dark:text-white">
                  {seat.designator}
                </TableCell>
                <TableCell className="whitespace-nowrap">{toHuman.cabinLayout.cabinClass(seat.cabin)}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {seat.rating === null ? "Not rated" : toHuman.cabinLayout.seatRating(seat.rating)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {seat.windowStatus === null ? "Not reported" : toHuman.cabinLayout.windowStatus(seat.windowStatus)}
                </TableCell>
                <TableCell className="whitespace-nowrap">{availability(seat)}</TableCell>
                <TableCell className="w-full min-w-64 whitespace-normal break-words">
                  {seat.comments.length === 0 ? (
                    <span className="text-gray-400 dark:text-gray-500">None</span>
                  ) : (
                    <ul className="space-y-0.5">
                      {seat.comments.map((comment) => (
                        <li key={comment.slug}>
                          {`${toHuman.cabinLayout.commentSentiment(comment.sentiment)}: ${comment.comment}`}
                          {comment.severity !== null &&
                            ` (${toHuman.cabinLayout.commentSeverity(comment.severity).toLowerCase()})`}
                        </li>
                      ))}
                    </ul>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
