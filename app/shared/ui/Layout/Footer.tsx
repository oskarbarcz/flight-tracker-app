import { FaHeart } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="px-6 py-4 text-end text-xs md:text-sm text-gray-500 dark:text-gray-400">
      {"Created with "}
      <FaHeart className="inline-block" />
      {" by "}
      <a
        href="https://github.com/oskarbarcz"
        className="font-bold text-indigo-600 dark:text-indigo-400"
        target={"_blank"}
        rel="noopener"
      >
        Oskar&nbsp;Barcz
      </a>
      {" and "}
      <a
        href="https://github.com/kodowiec"
        className="font-bold text-indigo-600 dark:text-indigo-400"
        target={"_blank"}
        rel="noopener"
      >
        Kamil&nbsp;Synowiec
      </a>
    </footer>
  );
}
