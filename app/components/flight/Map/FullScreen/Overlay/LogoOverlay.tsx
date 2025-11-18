import React from "react";
import Container from "~/components/shared/Layout/Container";
import Logo from "~/components/shared/Layout/Logo";
import { Link } from "react-router";

export default function LogoOverlay() {
  return (
    <Container className="shadow-xs">
      <Link className="flex items-center justify-center" to="/">
        <Logo />
      </Link>
    </Container>
  );
}
