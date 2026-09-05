import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/KpiCard";
import { SimpleTable, TableCard, TablePagination, TableSkeleton, EmptyState } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { api, qk } from "@/services/api";

export const Route = createFileRoute("/goals")({
  head: () => ({
    meta: [
      { title: "Goals — TSHAY BANK Branch Performance" },
      { name: "description", content: "Define financial and non-financial branch performance goals for TSHAY BANK." },
      { property: "og:title", content: "Goals — TSHAY BANK Branch Performance" },
      { property: "og:description", content: "Define financial and non-financial branch performance goals." },
    ],
  }),
  component: GoalsPage,
});

function GoalsPage() {
  const { data, isLoading } = useQuery({ queryKey: qk.goals, queryFn: api.goals });
  const [open, setOpen] = useState(false);
  const [remove, setRemove] = useState<string | null>(null);
  const goals = data ?? [];

  return (
    <AppShell title="Goals" breadcrumb="TSHAY BANK / Goals">
      <PageHeader
        title="Goals"
        subtitle="Manage branch performance goals"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Create Goal
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Goals" value={String(goals.length)} />
        <StatCard label="Financial" value={String(goals.filter((g) => g.category === "Financial").length)} />
        <StatCard label="Non-Financial" value={String(goals.filter((g) => g.category === "Non-Financial").length)} />
      </div>

      <div className="mt-6">
        <TableCard title="Goal catalogue" description="Goals available for target assignment" footer={<TablePagination count={goals.length} />}>
          {isLoading ? (
            <TableSkeleton cols={6} />
          ) : goals.length === 0 ? (
            <EmptyState title="No goals yet" description="Create your first branch performance goal." />
          ) : (
            <SimpleTable head={["Goal", "Category", "Measurement", "Status", "Description", "Actions"]}>
              {goals.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell>{g.category}</TableCell>
                  <TableCell>{g.measurement}</TableCell>
                  <TableCell><StatusBadge status={g.status} /></TableCell>
                  <TableCell className="max-w-[22rem] text-muted-foreground">{g.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" aria-label="Edit goal" onClick={() => toast.message("Edit goal", { description: `${g.name}` })}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Delete goal" onClick={() => setRemove(g.name)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </SimpleTable>
          )}
        </TableCard>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Goal</DialogTitle>
            <DialogDescription>Goals drive the targets assigned to branch employees.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              toast.success("Goal created");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="goalName">Goal name</Label>
              <Input id="goalName" placeholder="e.g. IFB Deposit" required />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue="Financial">
                  <SelectTrigger id="category" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Non-Financial">Non-Financial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="measurement">Measurement</Label>
                <Select defaultValue="Amount">
                  <SelectTrigger id="measurement" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Amount">Amount</SelectItem>
                    <SelectItem value="Count">Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Short description of what this goal measures" rows={3} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Create goal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!remove} onOpenChange={(o) => !o && setRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{remove}”?</AlertDialogTitle>
            <AlertDialogDescription>
              Targets already assigned to this goal will no longer be measured. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.success("Goal deleted");
                setRemove(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
