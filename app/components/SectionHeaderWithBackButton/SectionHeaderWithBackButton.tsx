import { Link } from "react-router";
import { Button } from "flowbite-react";
import { HiOutlineArrowLeft } from "react-icons/hi";

type SectionHeaderWithBackButtonProps = {
  sectionTitle: string;
  backUrl: string;
  backText: string;
};

export default function SectionHeaderWithBackButton({
  sectionTitle,
  backUrl,
  backText,
}: SectionHeaderWithBackButtonProps) {
  return (
    <div className="mx-auto my-6">
      <Link className="block" to={backUrl} replace={true}>
        <Button color="gray" size="xs">
          <HiOutlineArrowLeft className="mr-2 size-4" />
          {backText}
        </Button>
      </Link>
      <h2 className="mt-3 text-3xl font-bold text-gray-800 dark:text-white">
        {sectionTitle}
      </h2>
    </div>
  );
}
