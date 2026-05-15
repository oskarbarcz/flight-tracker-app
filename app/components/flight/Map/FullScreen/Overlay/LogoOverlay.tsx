import React from "react";
import { Link } from "react-router";
import { Logo } from "~/components/shared/Layout/Logo";
import { TransparentContainer } from "~/components/shared/Layout/TransparentContainer";

export function LogoOverlay() {
  return (
    <TransparentContainer padding="normal" className="shadow-xs">
      <Link className="flex items-center justify-center" to="/">
        <Logo />
      </Link>
    </TransparentContainer>
  );
}
