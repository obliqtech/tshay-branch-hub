import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Plus, Search, Eye } from "lucide-react";
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
import { api, formatETB, qk } from "@/services/api";
import type { Customer } from "@/lib/mock-data";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — TSHAY BANK Branch Performance" },
      { name: "description", content: "Register and review conventional and IFB customers served by the branch." },
      { property: "og:title", content: "Customers — TSHAY BANK Branch Performance" },
      { property: "og:description", content: "Register and review conventional and IFB branch customers." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const { data, isLoading } = useQuery({ queryKey: qk.customers, queryFn: api.customers });
  const { data: accounts } = useQuery({ queryKey: qk.accounts, queryFn: api.accounts });
  const { data: activities } = useQuery({ queryKey: qk.activities(), queryFn: () => api.activities() });
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Customer | null>(null);

  const all = data ?? [];
  const rows = useMemo(
    () =>
      all.filter(
        (c) =>
          (!q || c.fullName.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q)) &&
          (type === "all" || c.bankingType === type),
      ),
    [all, q, type],
  );

  return (
    <AppShell title="Customers" breadcrumb="TSHAY BANK / Customers">
      <PageHeader
        title="Customers"
        subtitle="Branch customer register"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Register Customer
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Customers" value={String(all.length)} />
        <StatCard label="Conventional" value={String(all.filter((c) => c.bankingType === "Conventional").length)} />
        <StatCard label="IFB" value={String(all.filter((c) => c.bankingType === "IFB").length)} />
      </div>

      <div className="mt-6">
        <TableCard
          title="Customer register"
          toolbar={
            <>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customer..." className="w-full pl-9 sm:w-60" />
              </div>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Banking type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="Conventional">Conventional</SelectItem>
                  <SelectItem value="IFB">IFB</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
          footer={<TablePagination count={rows.length} />}
        >
          {isLoading ? (
            <TableSkeleton cols={8} />
          ) : rows.length === 0 ? (
            <EmptyState title="No customers found" description="Try a different search term or register a new customer." />
          ) : (
            <SimpleTable head={["Full Name", "Phone", "Identification", "Type", "Branch", "Registered By", "Status", "Registered", "Actions"]}>
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.fullName}</TableCell>
                  <TableCell className="num whitespace-nowrap">{c.phone}</TableCell>
                  <TableCell>{c.identification}</TableCell>
                  <TableCell><StatusBadge status={c.bankingType} /></TableCell>
                  <TableCell className="whitespace-nowrap">{c.branch}</TableCell>
                  <TableCell>{c.registeredBy}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{c.registeredDate}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" aria-label="View customer" onClick={() => setDetail(c)}>
                      <Eye className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </SimpleTable>
          )}
        </TableCard>
      </div>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{detail?.fullName}</DialogTitle>
            <DialogDescription>Customer profile, accounts and recorded activities.</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-6">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["Phone", detail.phone],
                  ["Identification type", detail.identification],
                  ["Banking type", detail.bankingType],
                  ["Branch", detail.branch],
                  ["Registered by", detail.registeredBy],
                  ["Registered date", detail.registeredDate],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border bg-secondary/40 p-3">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">Accounts</h4>
                <div className="space-y-2">
                  {(accounts ?? []).filter((a) => a.customer === detail.fullName).map((a) => (
                    <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm">
                      <span className="num font-medium">{a.number}</span>
                      <span className="text-muted-foreground">{a.accountType}</span>
                      <span className="num">{formatETB(a.openingAmount)}</span>
                      <StatusBadge status={a.status} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">Activities</h4>
                <div className="space-y-2">
                  {(activities ?? []).filter((a) => a.customer === detail.fullName).map((a) => (
                    <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm">
                      <span className="font-medium">{a.activity}</span>
                      <span className="text-muted-foreground">{a.employee}</span>
                      <span className="num">{a.amount ? formatETB(a.amount) : "—"}</span>
                      <StatusBadge status={a.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Register Customer</DialogTitle>
            <DialogDescription>Capture the customer KYC details to open a relationship.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              toast.success("Customer registered");
            }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-name">Full name</Label>
                <Input id="c-name" placeholder="Ahmed Ali Yusuf" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-phone">Phone</Label>
                <Input id="c-phone" placeholder="+251 911 000 000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-id">Identification type</Label>
                <Select defaultValue="National ID">
                  <SelectTrigger id="c-id" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["National ID", "Passport", "Driving License", "Kebele ID"].map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-type">Banking type</Label>
                <Select defaultValue="Conventional">
                  <SelectTrigger id="c-type" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conventional">Conventional</SelectItem>
                    <SelectItem value="IFB">IFB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Register customer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
