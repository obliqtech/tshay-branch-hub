import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Plus, Pencil, Eye } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/KpiCard";
import { EmptyState, SimpleTable, TableCard, TablePagination, TableSkeleton } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AchievementBar } from "@/components/common/ProgressStat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableCell, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api, formatETB, formatNumber, pct, qk } from "@/services/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/targets")({
  head: () => ({
    meta: [
      { title: "Employee Targets — TSHAY BANK" },
      { name: "description", content: "Assign and track monthly deposit, customer and digital banking targets per employee." },
      { property: "og:title", content: "Employee Targets — TSHAY BANK" },
      { property: "og:description", content: "Assign and track deposit, customer and digital banking targets." },
    ],
  }),
  component: TargetsPage,
});

function TargetsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const scope = isAdmin ? undefined : user?.name;
  const { data, isLoading } = useQuery({ queryKey: qk.targets(scope), queryFn: () => api.targets(scope) });
  const { data: employees } = useQuery({ queryKey: qk.employees, queryFn: api.employees });
  const { data: goals } = useQuery({ queryKey: qk.goals, queryFn: api.goals });

  const [employee, setEmployee] = useState("all");
  const [goal, setGoal] = useState("all");
  const [period, setPeriod] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);

  const rows = useMemo(
    () =>
      (data ?? []).filter(
        (t) =>
          (employee === "all" || t.employee === employee) &&
          (goal === "all" || t.goal === goal) &&
          (period === "all" || t.period === period) &&
          (status === "all" || t.status === status),
      ),
    [data, employee, goal, period, status],
  );

  const fmt = (v: number, unit: string) => (unit === "ETB" ? formatETB(v) : formatNumber(v));
  const avg = rows.length ? Math.round(rows.reduce((s, t) => s + pct(t.achieved, t.target), 0) / rows.length) : 0;

  return (
    <AppShell title={isAdmin ? "Employee Targets" : "My Targets"} breadcrumb={`TSHAY BANK / ${isAdmin ? "Targets" : "My Targets"}`}>
      <PageHeader
        title={isAdmin ? "Employee Targets" : "My Targets"}
        subtitle={isAdmin ? "Assign and monitor targets across the branch" : "Your assigned targets for this period"}
        actions={
          isAdmin ? (
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" /> Assign Target
            </Button>
          ) : null
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Targets shown" value={String(rows.length)} />
        <StatCard label="Average achievement" value={`${avg}%`} />
        <StatCard label="Fully achieved" value={String(rows.filter((t) => pct(t.achieved, t.target) >= 100).length)} />
      </div>

      <div className="mt-6">
        <TableCard
          title="Target register"
          toolbar={
            <>
              {isAdmin && (
                <Select value={employee} onValueChange={setEmployee}>
                  <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Employee" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All employees</SelectItem>
                    {(employees ?? []).map((e) => (
                      <SelectItem key={e.id} value={`${e.firstName} ${e.lastName}`}>{e.firstName} {e.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger className="w-full sm:w-52"><SelectValue placeholder="Goal" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All goals</SelectItem>
                  {(goals ?? []).map((g) => <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Period" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All periods</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
          footer={<TablePagination count={rows.length} />}
        >
          {isLoading ? (
            <TableSkeleton cols={8} />
          ) : rows.length === 0 ? (
            <EmptyState title="No targets found" description="Adjust the filters or assign a new target." />
          ) : (
            <SimpleTable head={["Employee", "Goal", "Period", "Target", "Achieved", "Remaining", "Achievement", "Status", "Actions"]}>
              {rows.map((t) => {
                const p = pct(t.achieved, t.target);
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.employee}</TableCell>
                    <TableCell>{t.goal}</TableCell>
                    <TableCell>{t.period}</TableCell>
                    <TableCell className="num whitespace-nowrap">{fmt(t.target, t.unit)}</TableCell>
                    <TableCell className="num whitespace-nowrap">{fmt(t.achieved, t.unit)}</TableCell>
                    <TableCell className="num whitespace-nowrap text-muted-foreground">
                      {fmt(Math.max(t.target - t.achieved, 0), t.unit)}
                    </TableCell>
                    <TableCell className="min-w-40"><AchievementBar value={p} /></TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" aria-label="View target" onClick={() => toast.info(`${t.goal}`, { description: `${t.employee} · ${p}% achieved` })}>
                          <Eye className="size-4" />
                        </Button>
                        {isAdmin && (
                          <Button variant="ghost" size="icon" aria-label="Edit target" onClick={() => toast.message("Edit target", { description: "Available once the backend is connected." })}>
                            <Pencil className="size-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </SimpleTable>
          )}
        </TableCard>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Target</DialogTitle>
            <DialogDescription>Set a measurable target for an employee and period.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              toast.success("Target assigned");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="t-employee">Employee</Label>
              <Select defaultValue={(employees ?? [])[0] ? `${employees![0].firstName} ${employees![0].lastName}` : undefined}>
                <SelectTrigger id="t-employee" className="w-full"><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>
                  {(employees ?? []).map((e) => (
                    <SelectItem key={e.id} value={`${e.firstName} ${e.lastName}`}>{e.firstName} {e.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-goal">Goal</Label>
              <Select defaultValue={(goals ?? [])[0]?.name}>
                <SelectTrigger id="t-goal" className="w-full"><SelectValue placeholder="Select goal" /></SelectTrigger>
                <SelectContent>
                  {(goals ?? []).map((g) => <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="t-period">Period</Label>
                <Select defaultValue="Monthly">
                  <SelectTrigger id="t-period" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-value">Target value</Label>
                <Input id="t-value" type="number" min={1} placeholder="10000000" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-start">Start date</Label>
              <Input id="t-start" type="date" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Assign target</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
