import { Building2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/home/CategoryCard";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatsStrip } from "@/components/home/StatsStrip";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  getPublicCategories,
  getPublicDepartments,
  getPublicStats,
} from "@/lib/server-api";
import {config} from "../../../config/index"
export const metadata: Metadata = {
  title: { absolute: "Nagar Sheba | Smart City Services for Citizens" },
  description:
    "Report civic issues, pay service fees and track every request from submission to resolution.",
  openGraph: {
    title: "Nagar Sheba | Smart City Services for Citizens",
    description:
      "Report civic issues, pay service fees and track every request.",
    type: "website",
  },
};

export default async function HomePage() {
  const [stats, categories, departments] = await Promise.all([
    getPublicStats(),
    getPublicCategories(),
    getPublicDepartments(),
  ]);
  console.log(config.apiUrl)

  return (
    <>
      <Hero />
      <StatsStrip stats={stats} />
      <HowItWorks />

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Services"
              title="Popular city services"
              description="Free complaints and paid permits, each with a clear resolution time."
            />
          </Reveal>

          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((c) => (
              <StaggerItem key={c.id}>
                <CategoryCard category={c} />
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-8 text-center">
            <Link
              href="/services"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              View all services
            </Link>
          </div>
        </section>
      )}

      {departments.length > 0 && (
        <section className="border-y bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="Departments"
                title="Who handles your request"
              />
            </Reveal>

            <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {departments.map((d) => (
                <StaggerItem key={d.id}>
                  <Link
                    href={`/services?department=${d.id}`}
                    className="group block rounded-xl border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                      <Building2 className="size-5" />
                    </div>

                    <h3 className="mt-3 text-sm font-semibold">{d.name}</h3>

                    {d.description && (
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {d.description}
                      </p>
                    )}
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
