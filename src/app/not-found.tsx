import { MapPinOff } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10">
        <MapPinOff className="size-8 text-primary" />
      </div>
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className={cn(buttonVariants({ size: "lg" }), "mt-6 h-10 px-4")}
      >
        Back to home
      </Link>
    </div>
  );
}
