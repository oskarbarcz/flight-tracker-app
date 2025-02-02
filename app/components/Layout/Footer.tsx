"use client";

import { FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <div className="fixed bottom-4 right-6 pt-4 text-end text-sm text-gray-500">
        {"Created with "}
        <FaHeart className="inline-block" />
        {" by "}
        <a
          href="https://barcz.me"
          title="Let's get in touch!"
          className="font-bold text-teal-500"
        >
          Oskar Barcz
        </a>
      </div>
    </>
  );
}
