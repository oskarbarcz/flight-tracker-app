import type { ChangeRequest, ChangeRequestResource } from "~/features/change-request/model";

export enum QueueTab {
  Pending = "pending",
  Decided = "decided",
}

export type QueueView = {
  tab: QueueTab;
  kind: ChangeRequestResource | null;
};

export function requestsInTab(requests: ChangeRequest[], tab: QueueTab): ChangeRequest[] {
  if (tab === QueueTab.Pending) {
    return requests
      .filter((request) => request.isPending)
      .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());
  }

  return requests
    .filter((request) => !request.isPending)
    .sort((left, right) => (right.decidedAt?.getTime() ?? 0) - (left.decidedAt?.getTime() ?? 0));
}

export function requestsInView(requests: ChangeRequest[], view: QueueView): ChangeRequest[] {
  const inTab = requestsInTab(requests, view.tab);
  return view.kind === null ? inTab : inTab.filter((request) => request.resource === view.kind);
}

export function countByKind(requests: ChangeRequest[], kind: ChangeRequestResource): number {
  return requests.filter((request) => request.resource === kind).length;
}

export function competingRequests(requests: ChangeRequest[], request: ChangeRequest): ChangeRequest[] {
  return requests.filter(
    (candidate) => candidate.id !== request.id && candidate.isPending && candidate.targets(request),
  );
}

export function nextRequestAfter(visible: ChangeRequest[], currentId: string): ChangeRequest | null {
  const index = visible.findIndex((request) => request.id === currentId);
  if (index === -1) {
    return visible[0] ?? null;
  }
  return visible[index + 1] ?? visible[index - 1] ?? null;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatWaitingTime(since: Date, now: Date = new Date()): string {
  const elapsed = Math.max(0, now.getTime() - since.getTime());

  if (elapsed < HOUR) {
    return `${Math.max(1, Math.floor(elapsed / MINUTE))}m`;
  }
  if (elapsed < DAY) {
    return `${Math.floor(elapsed / HOUR)}h`;
  }
  return `${Math.floor(elapsed / DAY)}d`;
}
