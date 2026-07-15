import { FaCheck, FaTriangleExclamation } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

export function NoticeCondition({ ok, text }: { ok: boolean; text: string }) {
  const Icon = ok ? FaCheck : FaTriangleExclamation;
  return (
    <span
      className={twMerge(
        "flex items-center gap-2 text-xs font-semibold",
        ok ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400",
      )}
    >
      <Icon size={12} aria-hidden={true} />
      {text}
    </span>
  );
}
