import { FaCoffee } from "react-icons/fa";
import { Wordmark } from "~/shared/ui/Wordmark";

export function Footer() {
  return (
    <footer className="px-6 py-4 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
      <p>
        <Wordmark /> &copy; {new Date().getFullYear()}
      </p>
      <p>
        {"Created with lots of "}
        <FaCoffee className="inline-block" />
        {" by "}
        <a
          href="https://github.com/oskarbarcz"
          className="font-bold text-indigo-600 dark:text-indigo-400"
          target={"_blank"}
          rel="noopener"
        >
          Oskar&nbsp;Barcz
        </a>
      </p>
    </footer>
  );
}
