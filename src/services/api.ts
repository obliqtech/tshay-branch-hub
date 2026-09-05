/**
 * Mock API/service layer.
 *
 * Every UI screen reads through these functions only. When the PHP + MySQL
 * backend is ready, replace the bodies with fetch() calls to the endpoints
 * listed in ENDPOINTS (credentials: "include" for PHP sessions, plus a CSRF
 * token header). No component changes will be required.
 */

import {
  ACCOUNTS,
  ACTIVITIES,
  AUDIT_LOGS,
  BRANCHES,
  BRANCH_INFO,
  BRANCH_SUMMARY,
  CUSTOMERS,
  DEPOSIT_TREND,
  EMPLOYEES,
  GOALS,
  TARGETS,
  type Account,
  type Activity,
  type AuditLog,
  type Customer,
  type Employee,
  type Goal,
  type Target,
} from "@/lib/mock-data";

export const ENDPOINTS = {
  login: "/api/login.php",
  logout: "/api/logout.php",
  dashboard: "/api/dashboard.php",
  employees: "/api/employees.php",
  goals: "/api/goals.php",
  targets: "/api/targets.php",
  customers: "/api/customers.php",
  accounts: "/api/accounts.php",
  activities: "/api/activities.php",
  reports: "/api/reports.php",
  auditLogs: "/api/audit-logs.php",
  settings: "/api/settings.php",
} as const;

const LATENCY = 350;

function delay<T>(payload: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(payload), ms));
}

export const api = {
  branches: () => delay(BRANCHES),
  branchInfo: () => delay(BRANCH_INFO),
  dashboard: () => delay({ summary: BRANCH_SUMMARY, trend: DEPOSIT_TREND }),
  employees: (): Promise<Employee[]> => delay(EMPLOYEES),
  goals: (): Promise<Goal[]> => delay(GOALS),
  targets: (employee?: string): Promise<Target[]> =>
    delay(employee ? TARGETS.filter((t) => t.employee === employee) : TARGETS),
  customers: (): Promise<Customer[]> => delay(CUSTOMERS),
  accounts: (): Promise<Account[]> => delay(ACCOUNTS),
  activities: (employee?: string): Promise<Activity[]> =>
    delay(employee ? ACTIVITIES.filter((a) => a.employee === employee) : ACTIVITIES),
  auditLogs: (): Promise<AuditLog[]> => delay(AUDIT_LOGS),
};

export const qk = {
  dashboard: ["dashboard"] as const,
  employees: ["employees"] as const,
  goals: ["goals"] as const,
  targets: (employee?: string) => ["targets", employee ?? "all"] as const,
  customers: ["customers"] as const,
  accounts: ["accounts"] as const,
  activities: (employee?: string) => ["activities", employee ?? "all"] as const,
  auditLogs: ["audit-logs"] as const,
  branchInfo: ["branch-info"] as const,
};

export function formatETB(value: number, compact = false) {
  return `${new Intl.NumberFormat("en-US", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value)} ETB`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function pct(achieved: number, target: number) {
  if (!target) return 0;
  return Math.round((achieved / target) * 100);
}
