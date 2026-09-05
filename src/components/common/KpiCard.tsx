import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  trend,
  trendDirection = "up",
  icon: Icon,
}: {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
  icon: LucideIcon;
}) {
  const TrendIcon = trendDirection === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <Card className="gap-0 p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="num mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-[26px]">{value}</p>
      {trend && (
        <p
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-xs font-medium",
            trendDirection === "up" ? "text-success" : "text-destructive",
          )}
        >
          <TrendIcon className="size-3.5" />
          {trend}
        </p>
      )}
    </Card>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="gap-0 p-5 shadow-card">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="num mt-2 text-xl font-bold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
