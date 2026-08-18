import { Button } from "flowbite-react";
import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useAuth } from "~/app-state/useAuth";
import { ChangeSimbriefIdModal } from "~/features/user/components/ChangeSimbriefIdModal";
import { RecordNote } from "~/shared/ui/Record/RecordNote";
import { RecordRow } from "~/shared/ui/Record/RecordRow";
import { RecordValue } from "~/shared/ui/Record/RecordValue";

const explanation =
  "Importing a flight from SimBrief reads the latest OFP of this pilot ID. Without it, flights have to be planned by hand.";
const savedMessage = "SimBrief ID saved. Flight imports now read this pilot ID.";
const disconnectedMessage = "SimBrief disconnected. Flight imports are unavailable until you add an ID again.";

export function SimbriefSection() {
  const { user } = useAuth();
  const [outcome, setOutcome] = useState<"saved" | "disconnected" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (user === null) {
    return null;
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const simbriefUserId = user.simbriefUserId;

  return (
    <RecordRow
      label="SimBrief pilot ID"
      action={
        <Button color="light" size="sm" className="min-h-10 w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
          {simbriefUserId === null ? "Add ID" : "Change ID"}
        </Button>
      }
    >
      {simbriefUserId === null ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Not set</p>
      ) : (
        <RecordValue>{simbriefUserId}</RecordValue>
      )}

      {outcome === null ? (
        <RecordNote>{explanation}</RecordNote>
      ) : (
        <p role="status" className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
          <FaCircleCheck aria-hidden className="mt-0.5 shrink-0" />
          <span>{outcome === "saved" ? savedMessage : disconnectedMessage}</span>
        </p>
      )}

      {isModalOpen && (
        <ChangeSimbriefIdModal
          current={simbriefUserId}
          close={closeModal}
          onSaved={(saved) => {
            setOutcome(saved === null ? "disconnected" : "saved");
            closeModal();
          }}
        />
      )}
    </RecordRow>
  );
}
