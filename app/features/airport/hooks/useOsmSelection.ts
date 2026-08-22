import { useCallback, useState } from "react";
import { changesWithStatus, deselectChanges, selectChanges } from "~/features/airport/lib/osmProposal";
import type { OsmChangeStatus, OsmProposedChange } from "~/features/airport/model";

const NO_KEYS: ReadonlySet<string> = new Set();

export type OsmSelection = {
  keys: ReadonlySet<string>;
  toggle: (change: OsmProposedChange) => void;
  selectStatus: (status: OsmChangeStatus, select: boolean) => void;
};

export function useOsmSelection(changes: OsmProposedChange[], pullNumber: number): OsmSelection {
  const [state, setState] = useState({ pullNumber, keys: NO_KEYS });
  const keys = state.pullNumber === pullNumber ? state.keys : NO_KEYS;

  const replace = useCallback(
    (next: (current: Set<string>) => Set<string>) => {
      setState((current) => ({
        pullNumber,
        keys: next(new Set(current.pullNumber === pullNumber ? current.keys : NO_KEYS)),
      }));
    },
    [pullNumber],
  );

  const toggle = useCallback(
    (change: OsmProposedChange) => {
      replace((current) =>
        current.has(change.key)
          ? deselectChanges(changes, current, [change.key])
          : selectChanges(changes, current, [change.key]),
      );
    },
    [changes, replace],
  );

  const selectStatus = useCallback(
    (status: OsmChangeStatus, select: boolean) => {
      const targeted = changesWithStatus(changes, status).map((change) => change.key);
      replace((current) =>
        select ? selectChanges(changes, current, targeted) : deselectChanges(changes, current, targeted),
      );
    },
    [changes, replace],
  );

  return { keys, toggle, selectStatus };
}
