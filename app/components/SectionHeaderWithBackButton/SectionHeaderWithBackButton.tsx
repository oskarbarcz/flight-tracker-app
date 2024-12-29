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
    <div className="my-6 mx-auto">
      <Link className="block" to={backUrl} replace={true}>
        <Button color="gray" size="xs">
          <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
          {backText}
        </Button>
      </Link>
      <h2 className="text-3xl mt-3 font-bold text-gray-800 dark:text-white">
        {sectionTitle}
      </h2>
    </div>
  );
}
