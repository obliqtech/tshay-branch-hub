/**
 * Mock authentication + role simulation.
 * Later this is replaced by /api/login.php (PHP session cookie) — the
 * component API (useAuth) stays identical.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role } from "@/lib/mock-data";

export interface SessionUser {
  name: string;
  username: string;
  role: Role;
  roleLabel: string;
  branch: string;
  email: string;
  phone: string;
}

const ADMIN: SessionUser = {
  name: "Selam Girma",
  username: "admin",
  role: "admin",
  roleLabel: "Branch Admin",
  branch: "Main Branch",
  email: "selam.girma@tshaybank.et",
  phone: "+251 917 335 289",
};

const EMPLOYEE: SessionUser = {
  name: "Abebe Kebede",
  username: "abebe",
  role: "employee",
  roleLabel: "Marketing Officer",
  branch: "Main Branch",
  email: "abebe.kebede@tshaybank.et",
  phone: "+251 911 234 567",
};

const STORAGE_KEY = "tshay.session";

interface AuthValue {
  user: SessionUser | null;
  ready: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    await new Promise((r) => setTimeout(r, 700));
    const uname = username.trim().toLowerCase();
    if (password.length < 4) {
      throw new Error("Invalid username or password. Please try again.");
    }
    const next = uname === "admin" ? ADMIN : uname === "abebe" ? EMPLOYEE : null;
    if (!next) throw new Error("Invalid username or password. Please try again.");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
