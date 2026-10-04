import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency, formatSla } from "@/lib/format";
import { getPublicCategories, getPublicCategory } from "@/lib/server-api";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getPublicCategories();
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = await getPublicCategory(id);
  if (!category) return { title: "Service not found" };

  const description = `${category.name} (${category.department?.name ?? "City service"}). Resolved within ${formatSla(category.slaHours)}.`;
  return {
    title: category.name,
    description,
    openGraph: { title: `${category.name} | Nagar Sheba`, description },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const category = await getPublicCategory(id);
  if (!category) notFound();

  const paid = category.feeType === "PAID";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> All services
      </Link>

      <div className="rounded-xl border bg-card p-6 sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              {category.department?.name}
            </p>
            <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight">
              {category.name}
            </h1>
          </div>
          <Badge variant={paid ? "default" : "secondary"} className="h-6 px-2.5 text-xs">
            {paid ? formatCurrency(category.feeAmount) : "Free"}
          </Badge>
        </div>

        <dl className="mt-6 divide-y text-sm">
          <div className="flex justify-between py-3">
            <dt className="text-muted-foreground">Resolution time</dt>
            <dd className="flex items-center gap-1.5 font-medium">
              <Clock className="size-4" /> {formatSla(category.slaHours)}
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-muted-foreground">Fee</dt>
            <dd className="font-medium">
              {paid ? formatCurrency(category.feeAmount) : "No fee"}
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-muted-foreground">Handled by</dt>
            <dd className="font-medium">{category.department?.name ?? "—"}</dd>
          </div>
        </dl>

        <Link
          href={`/citizen/requests/new?category=${category.id}`}
          className={cn(buttonVariants(), "mt-8 h-11 w-full text-sm font-semibold")}
        >
          Request this service
        </Link>
      </div>
    </div>
  );
}