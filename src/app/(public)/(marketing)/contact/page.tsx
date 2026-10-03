import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import ContactForm from "@/components/form/ContactForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about a request, a payment or the platform? Get in touch with the Nagar Sheba team.",
  openGraph: {
    title: "Contact Nagar Sheba",
    description: "Get in touch with the Nagar Sheba team.",
  },
};

const INFO = [
  { icon: MapPin, label: "Office", value: SITE.address },
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  { icon: Phone, label: "Phone", value: SITE.phone, href: SITE.phoneHref },
  { icon: Clock, label: "Hours", value: "Sat - Thu, 9:00 AM - 5:00 PM" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Contact us"
        description="For questions about a specific request, include its tracking reference (NS-2026-000001)."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {INFO.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 rounded-xl border bg-card p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm font-medium hover:text-primary"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm font-medium">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-6 sm:p-8">
          <h2 className="mb-5 text-lg font-semibold">Send us a message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
