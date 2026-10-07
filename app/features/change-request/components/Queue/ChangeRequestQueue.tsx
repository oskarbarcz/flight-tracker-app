import { Button } from "flowbite-react";
import React from "react";
import { LuInbox } from "react-icons/lu";
import { ChangeRequestQueueRow } from "~/features/change-request/components/Queue/ChangeRequestQueueRow";
import { ChangeRequestQueueSkeleton } from "~/features/change-request/components/Queue/ChangeRequestQueueSkeleton";
import {
  competingRequests,
  countByKind,
  QueueTab,
  type QueueView,
  requestsInTab,
  requestsInView,
} from "~/features/change-request/lib/changeRequestQueue";
import {
  CHANGE_REQUEST_RESOURCES,
  type ChangeRequest,
  type ChangeRequestResource,
} from "~/features/change-request/model";
import { toHuman } from "~/i18n/translate";
import { PanelEmptyState } from "~/shared/ui/Display/PanelEmptyState";
import { FilterChoice } from "~/shared/ui/Filter/FilterChoice";
import { Container } from "~/shared/ui/Layout/Container";
import { TabLinkNav } from "~/shared/ui/Tabs/TabLinkNav";

type Props = {
  requests: ChangeRequest[];
  view: QueueView;
  isLoading: boolean;
  hasFailed: boolean;
  selectedId: string | null;
  tabHref: (tab: QueueTab) => string;
  rowHref: (requestId: string) => string;
  onSelectKind: (kind: ChangeRequestResource | null) => void;
  onRetry: () => void;
};

function QueueEmptyState({ view, isTabEmpty }: { view: QueueView; isTabEmpty: boolean }) {
  if (view.tab === QueueTab.Pending && isTabEmpty) {
    return (
      <PanelEmptyState
        icon={LuInbox}
        title="Queue clear"
        body="Corrections that cabin crew propose to airports, stands, gates, terminals and runways land here for review."
      />
    );
  }

  if (isTabEmpty) {
    return (
      <PanelEmptyState icon={LuInbox} title="No decisions yet" body="Accepted and rejected proposals appear here." />
    );
  }

  const kind = view.kind === null ? "" : `${toHuman.changeRequest.resource(view.kind).toLowerCase()} `;
  return (
    <PanelEmptyState
      icon={LuInbox}
      title={`No ${kind}proposals`}
      body={
        view.tab === QueueTab.Pending
          ? "Nothing of this kind is waiting for review."
          : "Nothing of this kind has been decided yet."
      }
    />
  );
}

function QueueFailure({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
      <p className="text-sm text-gray-700 dark:text-gray-300">The review queue could not be loaded.</p>
      <Button color="alternative" size="xs" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

export function ChangeRequestQueue({
  requests,
  view,
  isLoading,
  hasFailed,
  selectedId,
  tabHref,
  rowHref,
  onSelectKind,
  onRetry,
}: Props) {
  const inTab = requestsInTab(requests, view.tab);
  const visible = requestsInView(requests, view);
  const pendingCount = requestsInTab(requests, QueueTab.Pending).length;

  const renderList = () => {
    if (isLoading) {
      return <ChangeRequestQueueSkeleton />;
    }
    if (hasFailed) {
      return <QueueFailure onRetry={onRetry} />;
    }
    if (visible.length === 0) {
      return (
        <div className="p-3">
          <QueueEmptyState view={view} isTabEmpty={inTab.length === 0} />
        </div>
      );
    }
    return (
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {visible.map((request) => (
          <ChangeRequestQueueRow
            key={request.id}
            request={request}
            competingCount={request.isPending ? competingRequests(requests, request).length : 0}
            href={rowHref(request.id)}
            isSelected={request.id === selectedId}
          />
        ))}
      </ul>
    );
  };

  return (
    <Container padding="none" className="min-h-0 gap-0 md:sticky md:top-6 md:max-h-[calc(100dvh-3rem)]">
      <TabLinkNav
        label="Queue status"
        activeKey={view.tab}
        items={[
          { key: QueueTab.Pending, title: "To review", to: tabHref(QueueTab.Pending), count: pendingCount },
          { key: QueueTab.Decided, title: "Decided", to: tabHref(QueueTab.Decided) },
        ]}
      />
      <fieldset className="flex flex-wrap gap-1.5 border-b border-gray-200 px-3 py-2.5 dark:border-gray-800">
        <legend className="sr-only">Kind of data</legend>
        <FilterChoice
          label="All"
          count={isLoading ? undefined : inTab.length}
          isSelected={view.kind === null}
          onSelect={() => onSelectKind(null)}
        />
        {CHANGE_REQUEST_RESOURCES.map((kind) => (
          <FilterChoice
            key={kind}
            label={toHuman.changeRequest.resource(kind)}
            count={isLoading ? undefined : countByKind(inTab, kind)}
            isSelected={view.kind === kind}
            onSelect={() => onSelectKind(kind)}
          />
        ))}
      </fieldset>
      <div className="min-h-0 flex-1 overflow-y-auto">{renderList()}</div>
    </Container>
  );
}
