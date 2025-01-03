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
    <div className="my-6 flex items-center justify-between">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        {sectionTitle}
      </h2>
      <Link to={linkUrl} replace={true}>
        <Button size="sm">{linkText}</Button>
      </Link>
    </div>
  );
}
