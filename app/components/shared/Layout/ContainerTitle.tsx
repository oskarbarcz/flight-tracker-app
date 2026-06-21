import React from "react";
import type { IconType } from "react-icons";

type Props = {
  icon: IconType;
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function ContainerTitle({ icon: Icon, title, description, actions }: Props) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <div className="flex items-center gap-2 text-indigo-500">
          <Icon size={13} />
          <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
        </div>
        {description && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
