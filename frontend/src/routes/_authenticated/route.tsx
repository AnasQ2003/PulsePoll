import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PhoneShell } from "@/components/mobile/PhoneShell";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: Layout,
});

function Layout() {
  return <PhoneShell><Outlet /></PhoneShell>;
}
