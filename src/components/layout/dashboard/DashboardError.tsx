"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type Props = { error: Error & { digest?: string }; reset: () => void };

export function DashboardError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
      <TriangleAlert className="mb-3 size-9 text-destructive" />
      <h2 className="text-base font-semibold">This page hit a problem</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        The rest of the dashboard is still working. You can retry, or use the
        menu to go somewhere else.
      </p>
      <Button className="mt-5 h-9 px-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
