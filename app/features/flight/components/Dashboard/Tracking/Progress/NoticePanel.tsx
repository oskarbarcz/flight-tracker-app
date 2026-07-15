import type { ReactNode } from "react";
import type { IconType } from "react-icons";

type NoticeTone = "info" | "warning" | "neutral";

const toneClasses: Record<NoticeTone, { container: string; header: string; body: string }> = {
  info: {
    container: "border-sky-200 bg-sky-50 dark:border-sky-500/30 dark:bg-sky-500/10",
    header: "text-sky-800 dark:text-sky-300",
    body: "text-gray-700 dark:text-gray-200",
  },
  warning: {
    container: "border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10",
    header: "text-amber-800 dark:text-amber-300",
    body: "text-gray-700 dark:text-gray-200",
  },
  neutral: {
    container: "border-gray-200 bg-gray-50 dark:border-gray-500/30 dark:bg-gray-500/10",
    header: "text-gray-700 dark:text-gray-200",
    body: "text-gray-600 dark:text-gray-300",
  },
};

type NoticePanelProps = {
  tone: NoticeTone;
  icon: IconType;
  title: string;
  description: ReactNode;
  children?: ReactNode;
};

export function NoticePanel({ tone, icon: Icon, title, description, children }: NoticePanelProps) {
  const classes = toneClasses[tone];
  return (
    <div className={`rounded-xl border p-3 ${classes.container}`}>
      <div className={`flex items-center gap-2 text-sm font-bold ${classes.header}`}>
        <Icon size={15} aria-hidden={true} />
        {title}
      </div>
      <p className={`mt-1.5 text-sm ${classes.body}`}>{description}</p>
      {children && <div className="mt-2.5 flex flex-col gap-1.5">{children}</div>}
    </div>
  );
}
