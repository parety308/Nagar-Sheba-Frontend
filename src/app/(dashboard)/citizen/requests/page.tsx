import type { Metadata } from "next";
import NewRequestWizard from "@/components/request/NewRequestWizard";
import { PageHeader } from "@/components/shared/PageHeader";
import { getPublicCategories } from "@/lib/server-api";

export const metadata: Metadata = { title: "New request" };

type Props = { searchParams: Promise<{ category?: string }> };

export default async function NewRequestPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const categories = await getPublicCategories();

  return (
    <>
      <PageHeader
        title="New request"
        description="Report an issue or apply for a permit in four short steps."
      />
      <NewRequestWizard categories={categories} initialCategoryId={category} />
    </>
  );
}
