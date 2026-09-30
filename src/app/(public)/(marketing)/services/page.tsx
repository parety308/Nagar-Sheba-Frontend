import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/home/CategoryCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { getPublicCategories, getPublicDepartments } from "@/lib/server-api";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category.type";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse every city service: complaints and permits, with fees and resolution times.",
  openGraph: {
    title: "City Services | Nagar Sheba",
    description: "Browse every city service with fees and resolution times.",
  },
};

type Props = { searchParams: Promise<{ department?: string }> };

const chip =
  "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors";

export default async function ServicesPage({ searchParams }: Props) {
  const { department } = await searchParams;

  const [categories, departments] = await Promise.all([
    getPublicCategories(),
    getPublicDepartments(),
  ]);

  const filtered = department
    ? categories.filter((c) => c.departmentId === department)
    : categories;

  const grouped = new Map<string, Category[]>();
  for (const c of filtered) {
    const key = c.department?.name ?? "Other";
    grouped.set(key, [...(grouped.get(key) ?? []), c]);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="City services"
        description="Choose the service you need. Fees and resolution times are shown up front."
      />

      <div
        className="mb-8 flex flex-wrap gap-2"
        aria-label="Filter by department"
      >
        <Link
          href="/services"
          className={cn(
            chip,
            !department
              ? "border-primary bg-primary text-primary-foreground"
              : "hover:bg-muted",
          )}
        >
          All
        </Link>
        {departments.map((d) => (
          <Link
            key={d.id}
            href={`/services?department=${d.id}`}
            className={cn(
              chip,
              department === d.id
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            {d.name}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No services found"
          description="There are no active services for this filter right now."
        />
      ) : (
        <div className="space-y-10">
          {[...grouped.entries()].map(([name, items]) => (
            <section key={name}>
              <h2 className="mb-4 text-lg font-semibold">{name}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <CategoryCard key={c.id} category={c} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
