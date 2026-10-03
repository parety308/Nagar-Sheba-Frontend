import { Eye, HeartHandshake, ShieldCheck, Users, Wrench } from "lucide-react";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Nagar Sheba gives citizens one accountable place to report issues and gives city teams the tools to resolve them.",
  openGraph: {
    title: "About Nagar Sheba",
    description: "One accountable place for city services.",
  },
};

const VALUES = [
  {
    icon: Eye,
    title: "Transparency",
    text: "Every status change is recorded, so you always know where your request stands.",
  },
  {
    icon: ShieldCheck,
    title: "Accountability",
    text: "Each category has a service-level deadline, and overdue requests are flagged automatically.",
  },
  {
    icon: HeartHandshake,
    title: "Fairness",
    text: "Fees are shown before you pay, and cancelled paid requests are refunded.",
  },
];

const ROLES = [
  {
    icon: Users,
    title: "Citizens",
    text: "File requests, upload evidence, pay fees, reopen unresolved issues and rate the outcome.",
  },
  {
    icon: Wrench,
    title: "Department staff",
    text: "Work the queue for their own department, update progress and attach proof of resolution.",
  },
  {
    icon: ShieldCheck,
    title: "Administrators",
    text: "Manage departments and categories, assign work, oversee payments and review the audit trail.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <section className="border-b bg-gradient-to-b from-primary/10 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Better city services start with better follow-through
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Residents used to report road damage, water leaks and missed garbage
            collection through scattered channels, with no tracking and no
            deadlines. Nagar Sheba replaces that with one platform where every
            request has an owner, a deadline and a visible history.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow="Our principles" title="What we stand for" />
        </Reveal>

        <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <StaggerItem key={v.title}>
              <div className="h-full rounded-xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <v.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {v.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Who uses it"
              title="Three roles, one workflow"
              description="Each role sees only what it needs, and permissions are enforced on both the server and the interface."
            />
          </Reveal>

          <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
            {ROLES.map((r) => (
              <StaggerItem key={r.title}>
                <div className="h-full rounded-xl border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <r.icon className="size-6 text-primary" />
                  <h3 className="mt-3 text-base font-semibold">{r.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {r.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
