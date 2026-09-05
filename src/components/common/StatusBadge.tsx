import { CheckCircle2, Clock, XCircle, CircleDot, Ban, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const MAP: Record<string, { className: string; Icon: typeof CheckCircle2 }> = {
  Approved: { className: "bg-success-soft text-success", Icon: CheckCircle2 },
  Active: { className: "bg-success-soft text-success", Icon: CheckCircle2 },
  Pending: { className: "bg-warning-soft text-warning-foreground", Icon: Clock },
  Rejected: { className: "bg-danger-soft text-destructive", Icon: XCircle },
  Inactive: { className: "bg-secondary text-muted-foreground", Icon: CircleDot },
  Closed: { className: "bg-secondary text-muted-foreground", Icon: Ban },
  Blocked: { className: "bg-danger-soft text-destructive", Icon: Lock },
  Conventional: { className: "bg-primary-soft text-primary", Icon: CircleDot },
  IFB: { className: "bg-success-soft text-success", Icon: CircleDot },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const conf = MAP[status] ?? { className: "bg-secondary text-secondary-foreground", Icon: CircleDot };
  const { Icon } = conf;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
        conf.className,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {status}
    </span>
  );
}
