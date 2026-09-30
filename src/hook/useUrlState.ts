"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type ParamValue = string | number | boolean | null | undefined;

/**
 * Single source of truth for filters/sort/search/pagination in the URL.
 * Any component using this must be rendered inside <Suspense>.
 */
export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = useCallback(
    (key: string, fallback = "") => searchParams.get(key) ?? fallback,
    [searchParams],
  );

  const getNumber = useCallback(
    (key: string, fallback: number) => {
      const n = Number(searchParams.get(key));
      return Number.isFinite(n) && n > 0 ? n : fallback;
    },
    [searchParams],
  );

  const setParams = useCallback(
    (updates: Record<string, ParamValue>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      // Changing any filter (anything except page itself) resets to page 1
      if (!("page" in updates)) params.delete("page");

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { searchParams, get, getNumber, setParams };
}