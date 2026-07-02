import React from "react";
import type { IconType } from "react-icons";

type Props = {
  icon: IconType;
  title: string;
  actions?: React.ReactNode;
};

export function ContainerTitle({ icon: Icon, title, actions }: Props) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2 text-indigo-500">
        <Icon size={13} />
        <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
