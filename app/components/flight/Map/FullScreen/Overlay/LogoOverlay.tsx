import React from "react";
import { Link } from "react-router";
import Container from "~/components/shared/Layout/Container";
import Logo from "~/components/shared/Layout/Logo";

export default function LogoOverlay() {
  return (
    <Container className="shadow-xs">
      <Link className="flex items-center justify-center" to="/">
        <Logo />
      </Link>
    </Container>
  );
}
