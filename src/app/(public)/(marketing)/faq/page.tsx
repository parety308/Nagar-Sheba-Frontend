import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about filing requests, payments, refunds, reopening and tracking.",
  openGraph: {
    title: "Frequently asked questions | Nagar Sheba",
    description: "Answers about requests, payments, refunds and tracking.",
  },
};

const FAQS = [
  {
    group: "Requests",
    items: [
      {
        q: "How do I file a request?",
        a: "Create a citizen account, choose a service, describe the problem, set the location and attach up to 5 photos (5 MB each). You get a tracking reference like NS-2026-000001.",
      },
      {
        q: "Can I cancel a request?",
        a: "Yes, while it is still Pending Payment, Submitted or Assigned. Once work is in progress it can no longer be cancelled.",
      },
      {
        q: "What if the issue is not really fixed?",
        a: "You have 3 days after a request is marked Resolved to reopen it with a reason. After that it closes automatically.",
      },
      {
        q: "How long will it take?",
        a: "Every service shows its resolution time. The clock starts when the request is assigned, and overdue requests are flagged for administrators.",
      },
    ],
  },
  {
    group: "Payments",
    items: [
      {
        q: "Which services cost money?",
        a: "Permits such as trade licences, noise permits and tree-cutting permits are paid. Complaints such as potholes or garbage collection are free.",
      },
      {
        q: "How can I pay?",
        a: "Paid requests are settled online through SSLCommerz or bKash. Your request moves to Submitted as soon as the payment is verified.",
      },
      {
        q: "Do I get a refund if I cancel?",
        a: "Yes. Cancelling a paid request triggers an automatic refund to the original payment method. If it fails, an administrator can retry it.",
      },
      {
        q: "My payment failed. What now?",
        a: "Your request stays in Pending Payment, so you can start a new payment session from the request page at any time.",
      },
    ],
  },
  {
    group: "Account",
    items: [
      {
        q: "Why do I need to verify my email?",
        a: "We send a 6-digit code that is valid for 5 minutes. It confirms the address and protects your account.",
      },
      {
        q: "I forgot my password.",
        a: (
          <>
            Use{" "}
            <Link
              href="/forgot-password"
              className="text-primary underline underline-offset-4"
            >
              Forgot password
            </Link>{" "}
            to receive a reset code by email.
          </>
        ),
      },
      {
        q: "How do staff accounts work?",
        a: "Staff and administrator accounts are created by an administrator, who emails a temporary password that must be changed on first login.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeader
        title="Frequently asked questions"
        description="Can't find your answer? Contact us and we'll help."
      />

      <div className="space-y-10">
        {FAQS.map((section) => (
          <section key={section.group}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              {section.group}
            </h2>
            <div className="divide-y rounded-xl border bg-card">
              {section.items.map((item) => (
                <details key={item.q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
