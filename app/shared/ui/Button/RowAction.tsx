import React from "react";
import type { IconType } from "react-icons";
import { Link } from "react-router";

type Tone = "neutral" | "danger";

const SHAPE =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 transition-colors";

const TONES: Record<Tone, string> = {
  neutral: "hover:bg-gray-200 hover:text-indigo-500 dark:hover:bg-gray-800",
  danger: "hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40",
};

type CommonProps = {
  icon: IconType;
  label: string;
  tone?: Tone;
};

export function RowActionLink({ to, icon: Icon, label, tone = "neutral" }: CommonProps & { to: string }) {
  return (
    <Link to={to} viewTransition aria-label={label} className={`${SHAPE} ${TONES[tone]}`}>
      <Icon className="size-4" aria-hidden={true} />
    </Link>
  );
}

export function RowActionButton({
  onClick,
  icon: Icon,
  label,
  tone = "neutral",
}: CommonProps & { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className={`${SHAPE} ${TONES[tone]}`}>
      <Icon className="size-4" aria-hidden={true} />
    </button>
  );
}
