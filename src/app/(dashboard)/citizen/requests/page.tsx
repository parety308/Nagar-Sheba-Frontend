import { FilePlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RequestList } from "@/components/request/RequestList";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { PageHeader } from "@/components/shared/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "My requests" };

export default function CitizenRequestsPage() {
  return (
    <>
      <PageHeader
        title="My requests"
        description="Track every issue and permit you have filed."
        actions={
          <Link
            href="/citizen/requests/new"
            className={cn(buttonVariants(), "h-9 gap-2 px-4")}
          >
            <FilePlus className="size-4" /> New request
          </Link>
        }
      />
      <Suspense fallback={<RequestListSkeleton />}>
        <RequestList basePath="/citizen/requests" canCreate />
      </Suspense>
    </>
  );
}
