import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Target,
  Crosshair,
  UserRound,
  Wallet,
  Activity as ActivityIcon,
  TrendingUp,
  FileBarChart,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  Landmark,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { label: string; to: string; icon: typeof Users; roles: Array<"admin" | "employee"> };

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ["admin", "employee"] },
  { label: "Employees", to: "/employees", icon: Users, roles: ["admin"] },
  { label: "Goals", to: "/goals", icon: Target, roles: ["admin"] },
  { label: "Targets", to: "/targets", icon: Crosshair, roles: ["admin", "employee"] },
  { label: "Customers", to: "/customers", icon: UserRound, roles: ["admin", "employee"] },
  { label: "Accounts", to: "/accounts", icon: Wallet, roles: ["admin", "employee"] },
  { label: "Activities", to: "/activities", icon: ActivityIcon, roles: ["admin", "employee"] },
  { label: "Performance", to: "/performance", icon: TrendingUp, roles: ["admin", "employee"] },
  { label: "Reports", to: "/reports", icon: FileBarChart, roles: ["admin"] },
  { label: "Audit Logs", to: "/audit-logs", icon: ScrollText, roles: ["admin"] },
  { label: "Settings", to: "/settings", icon: Settings, roles: ["admin", "employee"] },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary/15 text-sidebar-primary-foreground ring-1 ring-sidebar-border">
        <Landmark className="size-5" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-sm font-extrabold tracking-wide text-sidebar-accent-foreground">TSHAY BANK</span>
          <span className="block text-[11px] text-sidebar-foreground/70">Branch Performance</span>
        </span>
      )}
    </div>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role ?? "employee";
  const items = NAV.filter((i) => i.roles.includes(role));
  const labelFor = (item: NavItem) =>
    role === "employee" && (item.label === "Targets" || item.label === "Performance")
      ? `My ${item.label}`
      : item.label;

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Brand />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
          >
            <item.icon className="size-[18px] shrink-0" />
            {labelFor(item)}
          </Link>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-[18px]" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  breadcrumb,
  searchPlaceholder,
  children,
}: {
  title: string;
  breadcrumb?: string;
  searchPlaceholder?: string;
  children: ReactNode;
}) {
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarNav />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] shadow-pop">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="absolute -right-11 top-3 grid size-9 place-items-center rounded-lg bg-card text-foreground shadow-card"
            >
              <X className="size-5" />
            </button>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">
              {breadcrumb ?? `TSHAY BANK / ${title}`}
            </p>
            <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">{title}</h2>
          </div>
          {searchPlaceholder && (
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="w-56 pl-9 lg:w-72" placeholder={searchPlaceholder} />
            </div>
          )}
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-secondary">
                <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block text-sm font-semibold">{user.name}</span>
                  <span className="block text-[11px] text-muted-foreground">{user.roleLabel}</span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <span className="block text-sm">{user.name}</span>
                <span className="block text-xs font-normal text-muted-foreground">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>Profile & settings</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className={cn("mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8")}>{children}</main>
      </div>
    </div>
  );
}
