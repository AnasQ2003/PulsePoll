import { motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { TopBar } from "./TopBar";
import { BottomTabs } from "./BottomTabs";
import type { ReactNode } from "react";

export function AppShell({ title, back, right, children }: { title: string; back?: boolean; right?: ReactNode; children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="h-full flex flex-col bg-background">
      <TopBar title={title} back={back} right={right} />
      <motion.main
        key={path}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 overflow-y-auto hide-scroll px-5 py-4"
      >
        {children}
      </motion.main>
      <BottomTabs />
    </div>
  );
}
