import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  value: ReactNode;
  icon: LucideIcon;
  hint?: string;
  tone?: "default" | "warning" | "success" | "danger";
};

const tones = {
  default: "bg-primary/10 text-primary",
  warning:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  success:
    "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
  danger: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  hint,
  tone = "default",
}: Props) {
  return (
    <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-primary/30">
      <CardContent className="flex items-center gap-4">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
            tones[tone],
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          {hint && (
            <p className="truncate text-[11px] text-muted-foreground">{hint}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
