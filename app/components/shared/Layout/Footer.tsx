"use client";

import { FaHeart } from "react-icons/fa";

export function Footer() {
  return (
    <div className="fixed bottom-4 right-6 pt-4 text-end text-xs md:text-sm text-gray-500">
      {"Created with "}
      <FaHeart className="inline-block" />
      {" by "}
      <a href="https://github.com/oskarbarcz" className="font-bold text-indigo-500" target={"_blank"} rel="noopener">
        Oskar&nbsp;Barcz
      </a>
      {" and "}
      <a href="https://github.com/kodowiec" className="font-bold text-indigo-500" target={"_blank"} rel="noopener">
        Kamil&nbsp;Synowiec
      </a>
    </div>
  );
}
