"use client";

import { Link } from "react-router";
import { Button } from "flowbite-react";

type SectionHeaderWithLinkProps = {
  sectionTitle: string;
  linkUrl: string;
  linkText: string;
};

export default function SectionHeaderWithLink({
  sectionTitle,
  linkUrl,
  linkText,
}: SectionHeaderWithLinkProps) {
  return (
    <div className="mb-4 p-8 flex items-center justify-between">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
        {sectionTitle}
      </h2>
      <Link to={linkUrl} replace viewTransition>
        <Button size="sm">{linkText}</Button>
      </Link>
    </div>
  );
}
