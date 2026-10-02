"use client";

import { FilterSelect } from "@/components/shared/FilterSelect";
import { useDepartments, useUrlState } from "@/hook";

type Props = { paramKey?: string; disabled?: boolean };

export function DepartmentFilter({ paramKey = "department", disabled }: Props) {
  const { get, setParams } = useUrlState();
  const { data } = useDepartments({ limit: 100 });

  const options = [
    { value: "all", label: "All departments" },
    ...(data?.data ?? []).map((d) => ({ value: d.id, label: d.name })),
  ];

  return (
    <FilterSelect
      label="Department"
      value={get(paramKey, "all")}
      options={options}
      disabled={disabled}
      onChange={(value) => setParams({ [paramKey]: value })}
    />
  );
}
