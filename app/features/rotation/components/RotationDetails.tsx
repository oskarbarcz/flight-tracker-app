import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { FaArrowLeft, FaCircleCheck } from "react-icons/fa6";
import { Link, useNavigate } from "react-router";
import { useToast } from "~/app-state/useToast";
import type { Airport } from "~/features/airport";
import { formatBlockTime, type Rotation } from "~/features/rotation";
import { EditRotationModal } from "~/features/rotation/components/EditRotationModal";
import { RotationCancellationNotice } from "~/features/rotation/components/RotationCancellationNotice";
import { RotationCaptainCard } from "~/features/rotation/components/RotationCaptainCard";
import { RotationLegsEditor } from "~/features/rotation/components/RotationLegsEditor";
import { RotationMap } from "~/features/rotation/components/RotationMap";
import { RotationRouteRibbon } from "~/features/rotation/components/RotationRouteRibbon";
import { RotationStatusBadge } from "~/features/rotation/components/RotationStatusBadge";
import { useRotationEditing } from "~/features/rotation/hooks/useRotationEditing";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  initialRotation: Rotation;
  airports: Airport[];
  operatorId: string;
  pilotName: string | null;
};

function readyHint(rotation: Rotation): string {
  if (rotation.legs.length < 2) {
    return "Add at least two legs to mark this rotation ready.";
  }
  return "Legs must form a continuous chain (each leg departs where the previous arrived, without overlapping).";
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <FieldLabel className="inline-block">{label}</FieldLabel>
      <span className="font-mono text-sm font-bold tabular-nums text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

export function RotationDetails({ initialRotation, airports, operatorId, pilotName }: Props) {
  const { success } = useToast();
  const navigate = useNavigate();
  const {
    rotation,
    editRotation,
    removeRotation,
    addLeg,
    updateLeg,
    removeLeg,
    attachFlight,
    detachFlight,
    markReady,
  } = useRotationEditing(initialRotation);
  const current = rotation as Rotation;
  const [editing, setEditing] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmingReady, setConfirmingReady] = useState(false);

  const onMarkReady = async () => {
    if (await markReady()) {
      success("Rotation marked ready.");
      setConfirmingReady(false);
    }
  };

  const onRemove = async () => {
    if (await removeRotation()) {
      navigate(`/operators/${operatorId}/rotations`, { viewTransition: true });
    }
  };

  const legCount = current.legs.length;
  const totalBlockTime = current.legs.reduce((sum, leg) => sum + leg.blockTime, 0);
  const completedCount = current.completedLegs.length;
  const offTimes = current.legs.map((leg) => leg.offBlockTime.getTime());
  const onTimes = current.legs.map((leg) => leg.onBlockTime.getTime());
  const totalTime = legCount > 0 ? Math.round((Math.max(...onTimes) - Math.min(...offTimes)) / 60_000) : 0;

  return (
    <div className="pb-6">
      <div className="mb-6">
        <div className="mb-3">
          <Button
            as={Link}
            to={`/operators/${operatorId}/rotations`}
            color="gray"
            outline
            size="sm"
            viewTransition
            aria-label="Back to rotations"
          >
            <FaArrowLeft className="mr-2" />
            Rotations
          </Button>
        </div>

        <Container padding="spacious" className="gap-5">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                Rotation
              </span>
              <h1 className="mt-1 truncate text-3xl font-bold text-gray-900 dark:text-white" title={current.name}>
                {current.name}
              </h1>
            </div>
            <RotationStatusBadge status={current.status} size="sm" />
          </header>

          <RotationRouteRibbon rotation={current} airports={airports} />

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              {legCount > 0 && (
                <>
                  <Metric label="Block time" value={formatBlockTime(totalBlockTime)} />
                  <Metric label="Total time" value={formatBlockTime(totalTime)} />
                  <Metric label="Flown" value={`${completedCount}/${legCount}`} />
                </>
              )}
            </div>
            {current.isDraft && (
              <div className="flex shrink-0 items-center gap-2">
                <Button color="gray" outline size="sm" onClick={() => setEditing(true)}>
                  Edit
                </Button>
                <Button color="red" outline size="sm" onClick={() => setRemoving(true)}>
                  Remove
                </Button>
                <Button
                  color="indigo"
                  size="sm"
                  disabled={!current.canMarkReady}
                  onClick={() => setConfirmingReady(true)}
                >
                  <FaCircleCheck className="mr-2" />
                  <span>Mark ready</span>
                </Button>
              </div>
            )}
          </div>

          {current.isDraft && !current.canMarkReady && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{readyHint(current)}</p>
          )}
        </Container>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <RotationCaptainCard name={pilotName} onEdit={current.isDraft ? () => setEditing(true) : undefined} />
          <RotationLegsEditor
            rotation={current}
            operatorId={operatorId}
            airports={airports}
            onAddLeg={addLeg}
            onUpdateLeg={updateLeg}
            onRemoveLeg={removeLeg}
            onAttachFlight={attachFlight}
            onDetachFlight={detachFlight}
          />
          {current.isCanceled && <RotationCancellationNotice rotation={current} />}
        </div>
        <RotationMap rotation={current} airports={airports} />
      </div>

      {editing && (
        <EditRotationModal
          name={current.name}
          pilotId={current.pilotId}
          onSave={editRotation}
          onClose={() => setEditing(false)}
        />
      )}

      {removing && (
        <Modal size="md" show onClose={() => setRemoving(false)}>
          <ModalHeader>Remove rotation</ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-200">
              Remove rotation <span className="font-semibold">{current.name}</span>? This cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <div className="ms-auto flex gap-2">
              <Button color="gray" outline onClick={() => setRemoving(false)}>
                Cancel
              </Button>
              <Button color="red" onClick={onRemove}>
                Remove rotation
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      )}

      {confirmingReady && (
        <Modal size="md" show onClose={() => setConfirmingReady(false)}>
          <ModalHeader>Mark rotation ready</ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-200">
              Mark rotation <span className="font-semibold">{current.name}</span> as ready? Its legs can no longer be
              edited afterwards.
            </p>
          </ModalBody>
          <ModalFooter>
            <div className="ms-auto flex gap-2">
              <Button color="gray" outline onClick={() => setConfirmingReady(false)}>
                Cancel
              </Button>
              <Button color="indigo" onClick={onMarkReady}>
                <FaCircleCheck className="mr-2" />
                <span>Mark ready</span>
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
