"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUrlState } from "@/hook/useUrlState";
import type { ApiMeta } from "@/types/api.type";

export function Pagination({ meta }: { meta?: ApiMeta }) {
  const { setParams } = useUrlState();

  if (!meta || meta.total === 0) return null;

  const { page, totalPages, total, limit } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Showing {from}-{to} of {total}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setParams({ page: page - 1 })}
        >
          <ChevronLeft /> Prev
        </Button>
        <span className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => setParams({ page: page + 1 })}
        >
          Next <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
