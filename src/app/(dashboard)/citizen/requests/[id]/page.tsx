import type { Metadata } from "next";
import { RequestDetail } from "@/components/request/RequestDetail";

export const metadata: Metadata = { title: "Request details" };

type Props = { params: Promise<{ id: string }> };

export default async function CitizenRequestDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <RequestDetail id={id} userRole="CITIZEN" backHref="/citizen/requests" />
  );
}
