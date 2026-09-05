import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox } from "lucide-react";

export function TableCard({
  title,
  description,
  toolbar,
  footer,
  children,
}: {
  title?: string;
  description?: string;
  toolbar?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="gap-0 overflow-hidden p-0 shadow-card">
      {(title || toolbar) && (
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
          {toolbar && <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">{toolbar}</div>}
        </div>
      )}
      <div className="w-full overflow-x-auto">{children}</div>
      {footer && <div className="border-t border-border p-4 sm:px-5">{footer}</div>}
    </Card>
  );
}

export function SimpleTable({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <Table className="min-w-[720px]">
      <TableHeader>
        <TableRow className="bg-secondary/60 hover:bg-secondary/60">
          {head.map((h) => (
            <TableHead key={h} className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Inbox className="size-6" />
      </span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-5 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function TablePagination({ count }: { count: number }) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
      <span>
        Showing <span className="font-semibold text-foreground">{count}</span> record{count === 1 ? "" : "s"}
      </span>
      <div className="flex items-center gap-2">
        <button className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground" disabled>
          Previous
        </button>
        <span className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">1</span>
        <button className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground" disabled>
          Next
        </button>
      </div>
    </div>
  );
}
