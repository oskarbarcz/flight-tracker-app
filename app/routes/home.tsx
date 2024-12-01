import type { Route } from "./+types/home";
import { Welcome } from "~/welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | Flight Tracker" },
    { name: "description", content: "This is flight tracker app." },
  ];
}

export default function Home() {
  return <Welcome />;
}
