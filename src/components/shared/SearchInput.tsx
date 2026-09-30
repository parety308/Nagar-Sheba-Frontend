"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hook/useDebounce";
import { useUrlState } from "@/hook/useUrlState";

type Props = { paramKey?: string; placeholder?: string };

export function SearchInput({ paramKey = "search", placeholder = "Search..." }: Props) {
  const { get, setParams } = useUrlState();
  const [value, setValue] = useState(get(paramKey));
  const debounced = useDebounce(value, 400);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only react to the debounced value
  useEffect(() => {
    if (debounced !== get(paramKey)) setParams({ [paramKey]: debounced });
  }, [debounced]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-9 pl-9"
        aria-label={placeholder}
      />
    </div>
  );
}