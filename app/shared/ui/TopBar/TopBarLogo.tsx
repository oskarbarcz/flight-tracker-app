import React from "react";
import { Link } from "react-router";
import logo from "~/assets/logo.svg";
import { Wordmark } from "~/shared/ui/Wordmark";

type Props = {
  size?: "md" | "lg";
};

const sizes = {
  md: { image: "h-5", label: "text-lg" },
  lg: { image: "h-7", label: "text-xl" },
};

export function TopBarLogo({ size = "md" }: Props) {
  const { image, label } = sizes[size];

  return (
    <Link to="/dashboard" replace className="flex items-center">
      <img src={logo} className={image} alt="MyPreflight app logo" />
      <Wordmark className={`${label} text-indigo-500 ms-2`} />
    </Link>
  );
}
