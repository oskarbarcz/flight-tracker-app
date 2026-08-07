import { Button } from "flowbite-react";
import { useState } from "react";
import { FaCircleCheck, FaCircleInfo } from "react-icons/fa6";
import { ChangePasswordModal } from "~/features/user/components/ChangePasswordModal";
import { RecordNote } from "~/shared/ui/Record/RecordNote";
import { RecordRow } from "~/shared/ui/Record/RecordRow";

type SectionState = { status: "idle" } | { status: "changed" } | { status: "unavailable"; message: string };

const consequence = "Changing it signs you out on every other device. This one stays signed in.";
const changedMessage = "Password changed. Every other session has been signed out.";

export function PasswordSection() {
  const [state, setState] = useState<SectionState>({ status: "idle" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  if (state.status === "unavailable") {
    return (
      <RecordRow label="Password">
        <p className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-pretty text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <FaCircleInfo aria-hidden className="mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </p>
      </RecordRow>
    );
  }

  return (
    <RecordRow
      label="Password"
      action={
        <Button color="light" size="sm" className="min-h-10 w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
          Change password
        </Button>
      }
    >
      {state.status === "changed" ? (
        <p role="status" className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
          <FaCircleCheck aria-hidden className="mt-0.5 shrink-0" />
          <span>{changedMessage}</span>
        </p>
      ) : (
        <RecordNote>{consequence}</RecordNote>
      )}

      {isModalOpen && (
        <ChangePasswordModal
          close={closeModal}
          onChanged={() => {
            setState({ status: "changed" });
            closeModal();
          }}
          onUnavailable={(message) => {
            setState({ status: "unavailable", message });
            closeModal();
          }}
        />
      )}
    </RecordRow>
  );
}
