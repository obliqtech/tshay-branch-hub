import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Banknote,
  Users,
  UserRound,
  Gauge,
  Smartphone,
  PiggyBank,
  CreditCard,
  QrCode,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard, StatCard } from "@/components/common/KpiCard";
import { SimpleTable, TableCard, TableSkeleton } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TargetProgressCard, AchievementBar } from "@/components/common/ProgressStat";
import { Card } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { api, formatETB, formatNumber, pct, qk } from "@/services/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TSHAY BANK Branch Performance" },
      { name: "description", content: "Branch deposit, customer and target achievement overview for TSHAY BANK." },
      { property: "og:title", content: "Dashboard — TSHAY BANK Branch Performance" },
      { property: "og:description", content: "Branch deposit, customer and target achievement overview." },
    ],
  }),
  component: DashboardPage,
});

const AXIS = { fontSize: 12, fill: "var(--muted-foreground)" };

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-0 p-5 shadow-card">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5 h-64 w-full">{children}</div>
    </Card>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  return (
    <AppShell title="Dashboard" breadcrumb="TSHAY BANK / Dashboard" searchPlaceholder="Search...">
      {isAdmin ? <AdminDashboard /> : <EmployeeDashboard name={user?.name.split(" ")[0] ?? "there"} />}
    </AppShell>
  );
}

function AdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: qk.dashboard, queryFn: api.dashboard });
  const { data: activities } = useQuery({ queryKey: qk.activities(), queryFn: () => api.activities() });
  const { data: targets } = useQuery({ queryKey: qk.targets(), queryFn: () => api.targets() });

  const summary = data?.summary;
  const conventionalShare = summary ? Math.round((summary.conventionalDeposit / summary.totalDeposit) * 100) : 0;

  const byEmployee = (targets ?? []).reduce<Record<string, { a: number; t: number }>>((acc, t) => {
    acc[t.employee] ??= { a: 0, t: 0 };
    const p = pct(t.achieved, t.target);
    acc[t.employee].a += p;
    acc[t.employee].t += 1;
    return acc;
  }, {});
  const employeePerf = Object.entries(byEmployee)
    .map(([name, v]) => ({ name: name.split(" ")[0], achievement: Math.round(v.a / v.t) }))
    .sort((a, b) => b.achievement - a.achievement);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Welcome back, Branch Admin" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Deposit" value={summary ? formatETB(summary.totalDeposit) : "—"} trend="+6.4% vs last month" icon={Banknote} />
        <KpiCard label="Total Customers" value={summary ? formatNumber(summary.totalCustomers) : "—"} trend="+48 this month" icon={UserRound} />
        <KpiCard label="Employees" value={summary ? String(summary.employees) : "—"} trend="2 new hires" icon={Users} />
        <KpiCard label="Target Achievement" value={summary ? `${summary.targetAchievement}%` : "—"} trend="-3% vs last month" trendDirection="down" icon={Gauge} />
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-foreground">Financial Performance</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total Deposit" value={summary ? formatETB(summary.totalDeposit) : "—"} />
          <StatCard label="Conventional Deposit" value={summary ? formatETB(summary.conventionalDeposit) : "—"} />
          <StatCard label="IFB Deposit" value={summary ? formatETB(summary.ifbDeposit) : "—"} />
          <StatCard label="Conventional %" value={`${conventionalShare}%`} hint="Share of total deposit" />
          <StatCard label="IFB %" value={`${100 - conventionalShare}%`} hint="Share of total deposit" />
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="Deposit performance" description="Conventional vs IFB deposit, in millions ETB">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.trend ?? []} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gIfb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={AXIS} tickLine={false} axisLine={false} />
                <YAxis tick={AXIS} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" name="Conventional" dataKey="conventional" stroke="var(--chart-1)" fill="url(#gConv)" strokeWidth={2} />
                <Area type="monotone" name="IFB" dataKey="ifb" stroke="var(--chart-3)" fill="url(#gIfb)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <ChartCard title="Deposit mix" description="Conventional vs IFB share">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: "Conventional", value: summary?.conventionalDeposit ?? 0 },
                  { name: "IFB", value: summary?.ifbDeposit ?? 0 },
                ]}
                dataKey="value"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                <Cell fill="var(--chart-1)" />
                <Cell fill="var(--chart-3)" />
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v: number) => formatETB(v, true)}
                contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6">
        <ChartCard title="Performance overview" description="Average target achievement by employee">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={employeePerf} margin={{ left: -18, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={AXIS} tickLine={false} axisLine={false} />
              <YAxis unit="%" tick={AXIS} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(v: number) => `${v}%`}
                contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }}
              />
              <Bar dataKey="achievement" name="Achievement" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={54} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6">
        <TableCard title="Recent activities" description="Latest branch activity records">
          {!activities ? (
            <TableSkeleton cols={7} />
          ) : (
            <SimpleTable head={["Employee", "Customer", "Activity", "Goal", "Amount", "Status", "Date"]}>
              {activities.slice(0, 6).map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.employee}</TableCell>
                  <TableCell>{a.customer}</TableCell>
                  <TableCell>{a.activity}</TableCell>
                  <TableCell className="text-muted-foreground">{a.goal}</TableCell>
                  <TableCell className="num">{a.amount ? formatETB(a.amount) : "—"}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{a.date}</TableCell>
                </TableRow>
              ))}
            </SimpleTable>
          )}
        </TableCard>
      </div>
      {isLoading && null}
    </>
  );
}

function EmployeeDashboard({ name }: { name: string }) {
  const { user } = useAuth();
  const { data: targets } = useQuery({ queryKey: qk.targets(user?.name), queryFn: () => api.targets(user?.name) });
  const { data: activities } = useQuery({
    queryKey: qk.activities(user?.name),
    queryFn: () => api.activities(user?.name),
  });

  const list = targets ?? [];
  const avg = list.length ? Math.round(list.reduce((s, t) => s + pct(t.achieved, t.target), 0) / list.length) : 0;
  const group = (names: string[]) => {
    const sel = list.filter((t) => names.includes(t.goal));
    if (!sel.length) return 0;
    return Math.round(sel.reduce((s, t) => s + pct(t.achieved, t.target), 0) / sel.length);
  };

  return (
    <>
      <PageHeader title={`Good morning, ${name}`} subtitle="Your performance at a glance" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Achievement" value={`${avg}%`} trend="+4% vs last week" icon={Gauge} />
        <KpiCard label="Deposit Achievement" value={`${group(["Conventional Deposit", "IFB Deposit"])}%`} trend="+2.1% vs last week" icon={PiggyBank} />
        <KpiCard label="Customer Achievement" value={`${group(["Conventional Customer", "IFB Customer"])}%`} trend="+9 customers" icon={UserRound} />
        <KpiCard
          label="Digital Achievement"
          value={`${group(["Mobile Banking", "Internet Banking", "Card Banking", "QR Banking"])}%`}
          trend="-1.5% vs last week"
          trendDirection="down"
          icon={Smartphone}
        />
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-foreground">My Targets</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((t) => (
            <TargetProgressCard
              key={t.id}
              goal={t.goal}
              achievedLabel={t.unit === "ETB" ? formatETB(t.achieved) : formatNumber(t.achieved)}
              targetLabel={t.unit === "ETB" ? formatETB(t.target) : formatNumber(t.target)}
              percent={pct(t.achieved, t.target)}
            />
          ))}
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="My digital banking performance" description="Achievement against monthly target">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={list
                  .filter((t) => ["Mobile Banking", "Internet Banking", "Card Banking", "QR Banking"].includes(t.goal))
                  .map((t) => ({ name: t.goal.replace(" Banking", ""), achievement: pct(t.achieved, t.target) }))}
                margin={{ left: -18, right: 8, top: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={AXIS} tickLine={false} axisLine={false} />
                <YAxis unit="%" tick={AXIS} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v: number) => `${v}%`}
                  contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }}
                />
                <Bar dataKey="achievement" name="Achievement" fill="var(--chart-2)" radius={[6, 6, 0, 0]} maxBarSize={54} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <Card className="gap-0 p-5 shadow-card">
          <h3 className="text-base font-semibold text-foreground">Overall progress</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">Across all assigned goals</p>
          <div className="mt-6 space-y-4">
            {list.slice(0, 5).map((t) => (
              <div key={t.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{t.goal}</span>
                </div>
                <AchievementBar value={pct(t.achieved, t.target)} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <TableCard title="My recent activities" description="Activities you recorded">
          {!activities ? (
            <TableSkeleton cols={6} />
          ) : (
            <SimpleTable head={["Customer", "Activity", "Goal", "Amount", "Status", "Date"]}>
              {activities.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.customer}</TableCell>
                  <TableCell>{a.activity}</TableCell>
                  <TableCell className="text-muted-foreground">{a.goal}</TableCell>
                  <TableCell className="num">{a.amount ? formatETB(a.amount) : "—"}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{a.date}</TableCell>
                </TableRow>
              ))}
            </SimpleTable>
          )}
        </TableCard>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Cards issued" value={`${list.find((t) => t.goal === "Card Banking")?.achieved ?? 0}`} hint="This month" />
        <StatCard label="QR merchants" value={`${list.find((t) => t.goal === "QR Banking")?.achieved ?? 0}`} hint="This month" />
        <StatCard label="IFB customers" value={`${list.find((t) => t.goal === "IFB Customer")?.achieved ?? 0}`} hint="This month" />
      </div>
      <div className="sr-only">
        <CreditCard /> <QrCode />
      </div>
    </>
  );
}
