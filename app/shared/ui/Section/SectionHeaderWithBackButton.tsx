import { Button } from "flowbite-react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { Link } from "react-router";

type Props = {
  sectionTitle?: string;
  backUrl: string;
  backText: string;
};

export function SectionHeaderWithBackButton({ sectionTitle, backUrl, backText }: Props) {
  return (
    <div className="mx-auto my-6">
      <Button as={Link} to={backUrl} viewTransition color="gray" size="xs" className="w-fit">
        <HiOutlineArrowLeft className="mr-2 size-4" />
        {backText}
      </Button>
      {sectionTitle && <h1 className="mt-3 text-3xl font-bold text-gray-800 dark:text-white">{sectionTitle}</h1>}
    </div>
  );
}
