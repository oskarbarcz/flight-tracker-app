import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import type { Airport } from "~/features/airport";
import type { Rotation, RotationLeg } from "~/features/rotation";
import { AddLegModal } from "~/features/rotation/components/AddLegModal";
import { AttachFlightModal } from "~/features/rotation/components/AttachFlightModal";
import { EditLegModal } from "~/features/rotation/components/EditLegModal";
import { RotationLegItem } from "~/features/rotation/components/RotationLegItem";
import type { LegFormData } from "~/features/rotation/form";
import { durationMinutes } from "~/shared/lib/time";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { CardToolbar } from "~/shared/ui/Layout/CardToolbar";
import { Container } from "~/shared/ui/Layout/Container";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  rotation: Rotation;
  operatorId: string;
  airports: Airport[];
  onAddLeg: (data: LegFormData) => Promise<boolean>;
  onUpdateLeg: (legId: string, data: LegFormData) => Promise<boolean>;
  onRemoveLeg: (legId: string) => Promise<boolean>;
  onAttachFlight: (legId: string, flightId: string) => Promise<boolean>;
  onDetachFlight: (legId: string) => Promise<boolean>;
};

export function RotationLegsEditor({
  rotation,
  operatorId,
  airports,
  onAddLeg,
  onUpdateLeg,
  onRemoveLeg,
  onAttachFlight,
  onDetachFlight,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [editingLeg, setEditingLeg] = useState<RotationLeg | null>(null);
  const [attachingLeg, setAttachingLeg] = useState<RotationLeg | null>(null);
  const [removingLeg, setRemovingLeg] = useState<RotationLeg | null>(null);

  const lastArrivalId = rotation.legs.length > 0 ? rotation.legs[rotation.legs.length - 1].arrival.id : "";

  const confirmRemoveLeg = async () => {
    if (!removingLeg) {
      return;
    }
    await onRemoveLeg(removingLeg.id);
    setRemovingLeg(null);
  };

  return (
    <Container padding="condensed" header={<CardHeader title="Legs" />}>
      {rotation.isDraft && (
        <CardToolbar>
          <Button size="xs" color="indigo" onClick={() => setAdding(true)}>
            <HiPlus className="mr-1.5" />
            <span>Add new</span>
          </Button>
        </CardToolbar>
      )}

      {rotation.legs.length === 0 ? (
        <p className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500 dark:bg-gray-900/40">
          No legs planned yet.
        </p>
      ) : (
        <ol className="mt-1">
          {rotation.legs.map((leg, index) => {
            const next = rotation.legs[index + 1];
            const turnaround = next
              ? {
                  minutes: durationMinutes(leg.onBlockTime, next.offBlockTime),
                  station: leg.arrival.id === next.departure.id ? leg.arrival.iataCode : null,
                }
              : null;

            return (
              <RotationLegItem
                key={leg.id}
                index={index}
                leg={leg}
                isLast={index === rotation.legs.length - 1}
                turnaround={turnaround}
                canEdit={rotation.isDraft}
                canAttach={rotation.isActive}
                onEdit={() => setEditingLeg(leg)}
                onRemove={() => setRemovingLeg(leg)}
                onAttach={() => setAttachingLeg(leg)}
                onDetach={() => onDetachFlight(leg.id)}
              />
            );
          })}
        </ol>
      )}

      {adding && (
        <AddLegModal
          airports={airports}
          defaultDepartureId={lastArrivalId}
          onAdd={onAddLeg}
          onClose={() => setAdding(false)}
        />
      )}

      {editingLeg && (
        <EditLegModal
          leg={editingLeg}
          airports={airports}
          onSave={(data) => onUpdateLeg(editingLeg.id, data)}
          onClose={() => setEditingLeg(null)}
        />
      )}

      {attachingLeg && (
        <AttachFlightModal
          operatorId={operatorId}
          leg={attachingLeg}
          onAttach={(flightId) => onAttachFlight(attachingLeg.id, flightId)}
          onClose={() => setAttachingLeg(null)}
        />
      )}

      {removingLeg && (
        <Modal size="md" show onClose={() => setRemovingLeg(null)}>
          <ModalHeader>
            <ModalTitle context="Leg" action="Remove" />
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700 dark:text-gray-200">
              Remove leg <span className="font-semibold">{removingLeg.flightNumber}</span> (
              {removingLeg.departure.iataCode} → {removingLeg.arrival.iataCode})?
            </p>
          </ModalBody>
          <ModalActions
            cancel={{ onClick: () => setRemovingLeg(null) }}
            confirm={{ label: "Remove leg", onClick: confirmRemoveLeg, tone: "danger" }}
          />
        </Modal>
      )}
    </Container>
  );
}
