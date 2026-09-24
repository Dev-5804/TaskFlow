"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const AuthContext = createContext<AuthContextValue | null>(null);

async function getJson(response: Response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Something went wrong");
  return body;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    async function restoreSession() {
      try {
        const refreshResponse = await fetch(`${apiUrl}/api/auth/refresh`, { method: "POST", credentials: "include" });
        if (!refreshResponse.ok) throw new Error("No session");
        const refreshData = await refreshResponse.json();
        const meResponse = await fetch(`${apiUrl}/api/auth/me`, { headers: { Authorization: `Bearer ${refreshData.accessToken}` }, credentials: "include" });
        const meData = await getJson(meResponse);
        setAccessToken(refreshData.accessToken);
        setUser(meData.user);
        setStatus("authenticated");
      } catch {
        setAccessToken(null);
        setUser(null);
        setStatus("unauthenticated");
      }
    }
    void restoreSession();
  }, []);

  async function login(email: string, password: string) {
    const response = await fetch(`${apiUrl}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email, password }) });
    const data = await getJson(response);
    setAccessToken(data.accessToken);
    setUser(data.user);
    setStatus("authenticated");
  }

  async function register(name: string, email: string, password: string) {
    const response = await fetch(`${apiUrl}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ name, email, password }) });
    const data = await getJson(response);
    setAccessToken(data.accessToken);
    setUser(data.user);
    setStatus("authenticated");
  }

  async function logout() {
    await fetch(`${apiUrl}/api/auth/logout`, { method: "POST", credentials: "include" });
    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }

  return <AuthContext.Provider value={{ user, accessToken, status, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
