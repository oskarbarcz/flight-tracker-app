import { Button, ModalFooter, Spinner } from "flowbite-react";
import React from "react";
import type { IconType } from "react-icons";
import { playModalExit } from "~/shared/lib/modalEntrance";

type CancelAction = {
  label?: string;
  onClick: () => void;
};

type ConfirmAction = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  form?: string;
  tone?: "primary" | "danger";
  icon?: IconType;
  trailing?: React.ReactNode;
  disabled?: boolean;
};

type Props = {
  cancel: CancelAction;
  confirm: ConfirmAction;
  pending?: boolean;
  pendingLabel?: string;
  note?: React.ReactNode;
};

export function ModalActions({ cancel, confirm, pending = false, pendingLabel, note }: Props) {
  const { label: cancelLabel = "Cancel", onClick: onCancel } = cancel;

  const dismiss = async () => {
    await playModalExit();
    onCancel();
  };
  const { label, onClick, type = "button", form, tone = "primary", icon: Icon, trailing, disabled = false } = confirm;

  return (
    <ModalFooter>
      {note && <div className="me-auto text-xs text-gray-500 dark:text-gray-400">{note}</div>}

      <Button size="xs" color="alternative" onClick={dismiss} disabled={pending} className="px-3.5">
        {cancelLabel}
      </Button>

      <Button
        size="xs"
        type={type}
        form={form}
        color={tone === "danger" ? "red" : "indigo"}
        onClick={onClick}
        disabled={pending || disabled}
        className="px-3.5 font-semibold"
      >
        <span className="flex items-center gap-1.5">
          {pending ? <Spinner size="xs" light /> : Icon && <Icon className="size-3.5 shrink-0" aria-hidden={true} />}
          <span>{pending ? (pendingLabel ?? label) : label}</span>
          {!pending && trailing}
        </span>
      </Button>
    </ModalFooter>
  );
}
