"use client";

import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopNav } from "@/components/navigation/TopNav";

export function AppShell({ children }: { children: ReactNode }) {
  return <ProtectedRoute><div className="app-shell">
      <TopNav />
      <div className="app-shell__body">
        <Sidebar />
        <main className="content-area">{children}</main>
      </div>
    </div></ProtectedRoute>;
}
