import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil, UserX, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/KpiCard";
import { EmptyState, SimpleTable, TableCard, TablePagination, TableSkeleton } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableCell, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api, qk } from "@/services/api";

export const Route = createFileRoute("/employees")({
  head: () => ({
    meta: [
      { title: "Employees — TSHAY BANK Branch Performance" },
      { name: "description", content: "Manage TSHAY BANK branch employees, roles, status and contact details." },
      { property: "og:title", content: "Employees — TSHAY BANK Branch Performance" },
      { property: "og:description", content: "Manage TSHAY BANK branch employees, roles and status." },
    ],
  }),
  component: EmployeesPage,
});

const ROLES = ["Branch Admin", "Customer Service", "Marketing Officer", "Teller"];

function EmployeesPage() {
  const { data, isLoading } = useQuery({ queryKey: qk.employees, queryFn: api.employees });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [deactivate, setDeactivate] = useState<string | null>(null);

  const rows = useMemo(() => {
    return (data ?? []).filter((e) => {
      const name = `${e.firstName} ${e.lastName}`.toLowerCase();
      const matchQ = !q || name.includes(q.toLowerCase()) || e.code.toLowerCase().includes(q.toLowerCase());
      return matchQ && (status === "all" || e.status === status) && (role === "all" || e.role === role);
    });
  }, [data, q, status, role]);

  const all = data ?? [];

  return (
    <AppShell title="Employees" breadcrumb="TSHAY BANK / Employees">
      <PageHeader
        title="Employees"
        subtitle="Manage branch employees"
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="size-4" /> Add Employee
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Employees" value={String(all.length)} />
        <StatCard label="Active" value={String(all.filter((e) => e.status === "Active").length)} />
        <StatCard label="Inactive" value={String(all.filter((e) => e.status === "Inactive").length)} />
      </div>

      <div className="mt-6">
        <TableCard
          title="Employee directory"
          toolbar={
            <>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search employee..."
                  className="w-full pl-9 sm:w-60"
                />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          }
          footer={<TablePagination count={rows.length} />}
        >
          {isLoading ? (
            <TableSkeleton cols={7} />
          ) : rows.length === 0 ? (
            <EmptyState title="No employees found" description="Try adjusting your search or filters." />
          ) : (
            <SimpleTable head={["Employee Code", "Name", "Phone", "Role", "Status", "Joined", "Actions"]}>
              {rows.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="num font-medium">{e.code}</TableCell>
                  <TableCell>
                    <span className="block font-medium text-foreground">{e.firstName} {e.lastName}</span>
                    <span className="block text-xs text-muted-foreground">{e.email}</span>
                  </TableCell>
                  <TableCell className="num whitespace-nowrap">{e.phone}</TableCell>
                  <TableCell>{e.role}</TableCell>
                  <TableCell><StatusBadge status={e.status} /></TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{e.joined}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" aria-label="View" onClick={() => toast.info(`${e.firstName} ${e.lastName}`, { description: `${e.role} · ${e.branch}` })}>
                        <Eye className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => toast.message("Edit employee", { description: "Editing is available once the backend is connected." })}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Deactivate" onClick={() => setDeactivate(`${e.firstName} ${e.lastName}`)}>
                        <UserX className="size-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="More actions"><MoreHorizontal className="size-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.success("Password reset link sent")}>Reset password</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Targets opened")}>View targets</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Activity log opened")}>View activity log</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </SimpleTable>
          )}
        </TableCard>
      </div>

      <AddEmployeeDialog open={addOpen} onOpenChange={setAddOpen} />

      <AlertDialog open={!!deactivate} onOpenChange={(o) => !o && setDeactivate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate {deactivate}?</AlertDialogTitle>
            <AlertDialogDescription>
              The employee will lose access to the branch performance system. Their historical records stay intact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.success(`${deactivate} deactivated`);
                setDeactivate(null);
              }}
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function AddEmployeeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    for (const key of ["firstName", "lastName", "username", "email", "phone", "code", "password"]) {
      if (!String(fd.get(key) ?? "").trim()) next[key] = "This field is required.";
    }
    const email = String(fd.get("email") ?? "");
    if (email && !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) next.email = "Enter a valid email address.";
    const pwd = String(fd.get("password") ?? "");
    if (pwd && pwd.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onOpenChange(false);
      toast.success("Employee added", { description: `${fd.get("firstName")} ${fd.get("lastName")} was created.` });
    }, 700);
  }

  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} aria-invalid={!!errors[name]} {...props} />
      {errors[name] && <p className="text-xs font-medium text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>Create a branch account. All fields are required.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {field("firstName", "First name", { placeholder: "Abebe" })}
            {field("lastName", "Last name", { placeholder: "Kebede" })}
            {field("username", "Username", { placeholder: "abebe.k" })}
            {field("email", "Email", { placeholder: "name@tshaybank.et", type: "email" })}
            {field("phone", "Phone", { placeholder: "+251 911 000 000" })}
            {field("code", "Employee code", { placeholder: "TB-1009" })}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" defaultValue="Customer Service">
                <SelectTrigger id="role" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="Active">
                <SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              {field("password", "Password", { type: "password", placeholder: "Minimum 8 characters" })}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save employee"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
