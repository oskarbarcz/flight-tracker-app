import {FaHeart} from "react-icons/fa";

export default function Footer() {

  return (
    <>
      <div className="absolute right-5 bottom-5 text-sm text-gray-500">
        {"Created with "}
        <FaHeart className="inline-block" />
        {" by "}
        <a href="https://barcz.me" title="Let's get in touch!" className="font-bold text-teal-500">Oskar Barcz</a>
      </div>
    </>
  );
}
