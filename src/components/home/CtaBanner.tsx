import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Help make your city work better
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/80 sm:text-base">
          Create a free citizen account and start tracking your requests today.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-11 px-6 text-sm font-semibold",
            )}
          >
            Create free account
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </section>
  );
}
