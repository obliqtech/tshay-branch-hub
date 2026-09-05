import { cn } from "@/lib/utils";

export function AchievementBar({ value, className }: { value: number; className?: string }) {
  const tone = value >= 90 ? "bg-success" : value >= 70 ? "bg-accent" : value >= 50 ? "bg-warning" : "bg-destructive";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 w-full min-w-20 overflow-hidden rounded-full bg-secondary">
        <div className={cn("h-full rounded-full transition-all", tone)} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span className="num w-11 shrink-0 text-right text-xs font-semibold text-foreground">{value}%</span>
    </div>
  );
}

export function TargetProgressCard({
  goal,
  achievedLabel,
  targetLabel,
  percent,
}: {
  goal: string;
  achievedLabel: string;
  targetLabel: string;
  percent: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{goal}</p>
        <span className="num text-sm font-bold text-primary">{percent}%</span>
      </div>
      <p className="num mt-1 text-sm text-muted-foreground">
        {achievedLabel} <span className="text-muted-foreground/70">/ {targetLabel}</span>
      </p>
      <AchievementBar value={percent} className="mt-3" />
    </div>
  );
}
