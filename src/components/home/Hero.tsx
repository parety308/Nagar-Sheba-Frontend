import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" />
          One platform for every city service
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Report it. Track it.{" "}
          <span className="text-primary">See it fixed.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Nagar Sheba connects citizens with city departments. File a complaint,
          pay service fees securely and follow every status update until your
          issue is resolved.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/citizen/requests/new"
            className={cn(
              buttonVariants(),
              "h-11 gap-2 px-6 text-sm font-semibold",
            )}
          >
            Report an issue
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 px-6 text-sm font-semibold",
            )}
          >
            Browse services
          </Link>
        </div>
      </div>
    </section>
  );
}
