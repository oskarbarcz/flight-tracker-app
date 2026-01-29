"use client";

import { Button } from "flowbite-react";
import React from "react";
import { Link } from "react-router";

type ActionButton = {
  text: string;
  url?: string;
  onClick?: () => void;
  color?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
};

type SectionHeaderWithLinkProps = {
  sectionTitle: string;
  primaryButton?: ActionButton;
  secondaryButton?: ActionButton;
};

function ActionButton({ button }: { button: ActionButton }) {
  const content = (
    <Button
      size="sm"
      color={button.color}
      className="cursor-pointer"
      onClick={button.onClick}
      disabled={button.disabled}
    >
      {button.icon && <span className="mr-2">{button.icon}</span>}
      {button.text}
    </Button>
  );

  if (button.url) {
    return (
      <Link to={button.url} replace viewTransition>
        {content}
      </Link>
    );
  }

  return content;
}

export default function SectionHeaderWithLink({
  sectionTitle,
  primaryButton,
  secondaryButton,
}: SectionHeaderWithLinkProps) {
  return (
    <div className="mb-2 md:mb-4 flex items-center justify-between">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
        {sectionTitle}
      </h2>
      <div className="flex gap-2 flex-col md:flex-row">
        {secondaryButton && <ActionButton button={secondaryButton} />}
        {primaryButton && <ActionButton button={primaryButton} />}
      </div>
    </div>
  );
}
