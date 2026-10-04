import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatSla } from "@/lib/format";
import type { Category } from "@/types/category.type";

export function CategoryCard({ category }: { category: Category }) {
  const isPaid = category.feeType === "PAID";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
      />
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug">
  <Link href={`/services/${category.id}`} className="hover:text-primary">
    {category.name}
  </Link>
</h3>
        <Badge
          variant={isPaid ? "default" : "secondary"}
          className="h-6 shrink-0 px-2.5 text-xs"
        >
          {isPaid ? formatCurrency(category.feeAmount) : "Free"}
        </Badge>
      </div>

      {category.department && (
        <p className="mt-1 text-xs text-muted-foreground">
          {category.department.name}
        </p>
      )}

      <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="size-3.5" />
        Resolved within {formatSla(category.slaHours)}
      </div>

      <Link
        href={`/citizen/requests/new?category=${category.id}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
      >
        Request this service
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
