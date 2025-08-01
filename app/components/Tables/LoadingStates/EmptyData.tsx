import { FaCircleInfo } from "react-icons/fa6";

type EmptyResultProps = {
  message: string;
};

export function EmptyData({ message }: EmptyResultProps) {
  return (
    <div className="py-5 flex items-center justify-center text-gray-500 text-center">
      <FaCircleInfo className="inline mr-2" />
      {message}
    </div>
  );
}
