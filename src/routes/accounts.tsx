import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Eye, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/KpiCard";
import { EmptyState, SimpleTable, TableCard, TablePagination, TableSkeleton } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, formatETB, qk } from "@/services/api";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts — TSHAY BANK Branch Performance" },
      { name: "description", content: "Review conventional and IFB accounts opened at the branch with status and balances." },
      { property: "og:title", content: "Accounts — TSHAY BANK Branch Performance" },
      { property: "og:description", content: "Review conventional and IFB accounts opened at the branch." },
    ],
  }),
  component: AccountsPage,
});

function AccountsPage() {
  const { data, isLoading } = useQuery({ queryKey: qk.accounts, queryFn: api.accounts });
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  const all = data ?? [];
  const rows = useMemo(
    () =>
      all.filter(
        (a) =>
          (!q || a.customer.toLowerCase().includes(q.toLowerCase()) || a.number.includes(q)) &&
          (type === "all" || a.bankingType === type) &&
          (status === "all" || a.status === status),
      ),
    [all, q, type, status],
  );

  return (
    <AppShell title="Accounts" breadcrumb="TSHAY BANK / Accounts">
      <PageHeader
        title="Accounts"
        subtitle="Accounts opened by branch employees"
        actions={
          <Button onClick={() => toast.message("Open account", { description: "Account opening form connects to the backend later." })}>
            <Plus className="size-4" /> Open Account
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Accounts" value={String(all.length)} />
        <StatCard label="Conventional" value={String(all.filter((a) => a.bankingType === "Conventional").length)} />
        <StatCard label="IFB" value={String(all.filter((a) => a.bankingType === "IFB").length)} />
        <StatCard label="Opening balance" value={formatETB(all.reduce((s, a) => s + a.openingAmount, 0))} />
      </div>

      <div className="mt-6">
        <TableCard
          title="Account register"
          toolbar={
            <>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search account..." className="w-full pl-9 sm:w-60" />
              </div>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Banking type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="Conventional">Conventional</SelectItem>
                  <SelectItem value="IFB">IFB</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </>
          }
          footer={<TablePagination count={rows.length} />}
        >
          {isLoading ? (
            <TableSkeleton cols={8} />
          ) : rows.length === 0 ? (
            <EmptyState title="No accounts found" description="Adjust the filters to see more accounts." />
          ) : (
            <SimpleTable head={["Account Number", "Customer", "Banking Type", "Account Type", "Opening Amount", "Opened By", "Opened Date", "Status", "Actions"]}>
              {rows.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="num font-medium">{a.number}</TableCell>
                  <TableCell>{a.customer}</TableCell>
                  <TableCell><StatusBadge status={a.bankingType} /></TableCell>
                  <TableCell className="whitespace-nowrap">{a.accountType}</TableCell>
                  <TableCell className="num whitespace-nowrap">{formatETB(a.openingAmount)}</TableCell>
                  <TableCell>{a.openedBy}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{a.openedDate}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="View account"
                      onClick={() => toast.info(a.number, { description: `${a.customer} · ${a.accountType} · ${a.status}` })}
                    >
                      <Eye className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </SimpleTable>
          )}
        </TableCard>
      </div>
    </AppShell>
  );
}
