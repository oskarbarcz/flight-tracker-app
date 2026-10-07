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
  viewTransition?: boolean;
};

type Props = {
  sectionTitle: string;
  primaryButton?: ActionButton;
  secondaryButton?: ActionButton;
};

const actionButtonClassName = "cursor-pointer shrink-0 whitespace-nowrap";

function ActionButton({ button }: { button: ActionButton }) {
  const content = (
    <>
      {button.icon && <span className="mr-2">{button.icon}</span>}
      {button.text}
    </>
  );

  if (button.url && !button.disabled) {
    return (
      <Button
        as={Link}
        to={button.url}
        viewTransition={button.viewTransition ?? true}
        size="sm"
        color={button.color}
        className={actionButtonClassName}
        onClick={button.onClick}
      >
        {content}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      color={button.color}
      className={actionButtonClassName}
      onClick={button.onClick}
      disabled={button.disabled}
    >
      {content}
    </Button>
  );
}

export function SectionHeaderWithButton({ sectionTitle, primaryButton, secondaryButton }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{sectionTitle}</h1>
      <div className="flex gap-2 flex-row flex-wrap">
        {secondaryButton && <ActionButton button={secondaryButton} />}
        {primaryButton && <ActionButton button={primaryButton} />}
      </div>
    </div>
  );
}
