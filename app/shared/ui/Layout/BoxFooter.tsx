import React from "react";

type Props = {
  children: React.ReactNode;
  leading?: React.ReactNode;
};

export function BoxFooter({ children, leading }: Props) {
  return (
    <div
      className={`flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800 ${
        leading ? "justify-between" : "justify-end"
      }`}
    >
      {leading}
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
