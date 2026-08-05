import { Button } from "flowbite-react";
import { useState } from "react";
import { FaCircleCheck, FaCircleInfo } from "react-icons/fa6";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { ChangePasswordModal } from "~/features/user/components/ChangePasswordModal";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type SectionState = { status: "idle" } | { status: "changed" } | { status: "unavailable"; message: string };

const explanation = "Change the password you use to sign in with your email address.";
const changedMessage = "Your password was changed. Every other session has been signed out.";

export function PasswordSection() {
  const [state, setState] = useState<SectionState>({ status: "idle" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <Container>
      <ContainerTitle icon={HiOutlineLockClosed} title="Password" />

      {state.status === "unavailable" && (
        <p className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-pretty text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <FaCircleInfo aria-hidden className="mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </p>
      )}

      {state.status === "changed" && (
        <p className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
          <FaCircleCheck aria-hidden className="mt-0.5 shrink-0" />
          <span>{changedMessage}</span>
        </p>
      )}

      {state.status === "idle" && (
        <>
          <p className="text-pretty text-sm text-gray-600 dark:text-gray-400">{explanation}</p>

          <div className="flex justify-start">
            <Button color="indigo" onClick={() => setIsModalOpen(true)}>
              Change password
            </Button>
          </div>
        </>
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
    </Container>
  );
}
