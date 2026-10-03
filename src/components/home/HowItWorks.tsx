import { Bell, CreditCard, FilePlus, Wrench } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/shared/SectionHeading";

const STEPS = [
  {
    icon: FilePlus,
    title: "File a request",
    text: "Pick a service, describe the problem, add the location and up to 5 photos.",
  },
  {
    icon: CreditCard,
    title: "Pay if required",
    text: "Paid services are settled securely through SSLCommerz or bKash.",
  },
  {
    icon: Wrench,
    title: "Department acts",
    text: "Your request is routed to the right department and worked within its SLA.",
  },
  {
    icon: Bell,
    title: "Track and confirm",
    text: "Get notified at every step, then reopen or rate the result.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From complaint to resolution in four steps"
        />

        <Stagger
          as="ol"
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((step, i) => (
            <StaggerItem
              as="li"
              key={step.title}
              className="group relative rounded-xl border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <span className="absolute top-4 right-4 text-3xl font-bold text-muted-foreground/20 transition-colors group-hover:text-primary/30">
                {i + 1}
              </span>

              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <step.icon className="size-5" />
              </div>

              <h3 className="mt-4 text-base font-semibold">{step.title}</h3>

              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {step.text}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
