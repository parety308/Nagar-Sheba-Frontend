
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUrlState } from "@/hook/useUrlState";
import type { ApiMeta } from "@/types/api.type";

function getPageItems(page: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [...new Set([1, total, page - 1, page, page + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const out: (number | "…")[] = [];
  let prev = 0;

  for (const n of pages) {
    if (n - prev > 1) {
      out.push("…");
    }

    out.push(n);
    prev = n;
  }

  return out;
}

export function Pagination({ meta }: { meta?: ApiMeta }) {
  const { setParams } = useUrlState();

  if (!meta || meta.total === 0) {
    return null;
  }

  const { page, totalPages, total, limit } = meta;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const items = getPageItems(page, totalPages);

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Showing {from}-{to} of {total}
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setParams({ page: page - 1 })}
        >
          <ChevronLeft />
          Prev
        </Button>

        {items.map((item, position) => {
          if (item === "…") {
            const previous = items[position - 1];
            const next = items[position + 1];

            return (
              <span
                key={`gap-${previous}-${next}`}
                className="px-1.5 text-xs text-muted-foreground"
              >
                …
              </span>
            );
          }

          return (
            <Button
              key={item}
              variant={item === page ? "default" : "outline"}
              size="sm"
              aria-current={item === page ? "page" : undefined}
              onClick={() => setParams({ page: item })}
            >
              {item}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => setParams({ page: page + 1 })}
        >
          Next
          <ChevronRight />
        </Button>
      </nav>
    </div>
  );
}
