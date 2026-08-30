import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { HiCloudDownload } from "react-icons/hi";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import { OsmProposalReview } from "~/features/airport/components/Enrichment/OsmProposalReview";
import { OsmPullPrompt } from "~/features/airport/components/Enrichment/OsmPullPrompt";
import { OsmPushReport } from "~/features/airport/components/Enrichment/OsmPushReport";
import { useOsmSelection } from "~/features/airport/hooks/useOsmSelection";
import { describeOsmPullFailure, describeOsmPushFailure } from "~/features/airport/lib/osmFailures";
import type { Airport, AirportOsmProposal, AirportOsmPushResult, OsmProposedChange } from "~/features/airport/model";
import { OsmChangeStatus } from "~/features/airport/model";
import { useApi } from "~/shared/api/useApi";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  airport: Airport;
  close: () => void;
  onApplied?: () => void;
};

const NO_CHANGES: OsmProposedChange[] = [];

function countRecords(count: number): string {
  return `${count} ${count === 1 ? "record" : "records"}`;
}

function countChanges(count: number): string {
  return `${count} ${count === 1 ? "change" : "changes"}`;
}

export function EnrichAirportDataModal({ airport, close, onApplied }: Props) {
  const { airportService } = useApi();
  const { error: showError, success, warning } = useToast();
  const revalidator = useRevalidator();

  const [proposal, setProposal] = useState<AirportOsmProposal | null>(null);
  const [pullNumber, setPullNumber] = useState(0);
  const [report, setReport] = useState<AirportOsmPushResult | null>(null);
  const [pullStartedAt, setPullStartedAt] = useState<number | null>(null);
  const [isPushing, setIsPushing] = useState(false);
  const [pullError, setPullError] = useState<string | null>(null);
  const isPulling = pullStartedAt !== null;

  const selection = useOsmSelection(proposal?.changes ?? NO_CHANGES, pullNumber);
  const selectedKeys = [...selection.keys];
  const removalCount = (proposal?.changes ?? NO_CHANGES).filter(
    (change) => change.status === OsmChangeStatus.Removed && selection.keys.has(change.key),
  ).length;

  const pull = async (refresh: boolean) => {
    setPullStartedAt(Date.now());
    setPullError(null);

    try {
      setProposal(await airportService.pullOpenStreetMapProposal(airport.id, refresh));
      setPullNumber((current) => current + 1);
      setReport(null);
    } catch (failure) {
      const message = describeOsmPullFailure(failure, airport.icaoCode);
      if (proposal === null) {
        setPullError(message);
      } else {
        showError(message);
      }
    } finally {
      setPullStartedAt(null);
    }
  };

  const apply = async () => {
    setIsPushing(true);

    try {
      const result = await airportService.pushOpenStreetMapProposal(airport.id, selectedKeys);
      const written = result.totals.added + result.totals.updated + result.totals.removed;

      setReport(result);
      revalidator.revalidate();
      onApplied?.();

      if (result.totals.failed > 0) {
        warning(`${countRecords(written)} written, ${result.totals.failed} could not be applied.`);
      } else {
        success(`${countRecords(written)} written to ${airport.icaoCode}.`);
      }
    } catch (failure) {
      showError(describeOsmPushFailure(failure));
    } finally {
      setIsPushing(false);
    }
  };

  const body = () => {
    if (report !== null) {
      return <OsmPushReport result={report} changes={proposal?.changes ?? NO_CHANGES} />;
    }

    if (proposal !== null) {
      return (
        <OsmProposalReview
          proposal={proposal}
          selection={selection}
          refreshStartedAt={pullStartedAt}
          onRefresh={() => pull(true)}
        />
      );
    }

    return <OsmPullPrompt icaoCode={airport.icaoCode} startedAt={pullStartedAt} error={pullError} />;
  };

  const reviewAgain = () => {
    setReport(null);
    pull(false);
  };

  const actions = () => {
    if (report !== null) {
      return (
        <ModalActions
          cancel={{ label: "Review again", onClick: reviewAgain, animateExit: false }}
          confirm={{ label: "Done", onClick: close }}
        />
      );
    }

    if (proposal !== null) {
      return (
        <ModalActions
          cancel={{ onClick: close }}
          confirm={{
            label: selectedKeys.length === 0 ? "Apply changes" : `Apply ${countChanges(selectedKeys.length)}`,
            onClick: apply,
            disabled: selectedKeys.length === 0 || isPulling,
            tone: removalCount > 0 ? "danger" : "primary",
          }}
          pending={isPushing}
          pendingLabel="Applying…"
          note={
            removalCount > 0
              ? `Deletes ${countRecords(removalCount)} that OpenStreetMap no longer reports.`
              : "Nothing is written until you apply."
          }
        />
      );
    }

    return (
      <ModalActions
        cancel={{ label: "Close", onClick: close }}
        confirm={{
          label: "Pull data from OpenStreetMap",
          onClick: () => pull(false),
          icon: HiCloudDownload,
          disabled: isPulling,
        }}
      />
    );
  };

  return (
    <Modal size="5xl" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>
        <ModalTitle context="Airport" action="Enrich from OpenStreetMap" />
      </ModalHeader>
      <ModalBody>{body()}</ModalBody>
      {actions()}
    </Modal>
  );
}
