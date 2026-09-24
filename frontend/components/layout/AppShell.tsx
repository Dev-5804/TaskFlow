import type { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopNav } from "@/components/navigation/TopNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <TopNav />
      <div className="app-shell__body">
        <Sidebar />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}
