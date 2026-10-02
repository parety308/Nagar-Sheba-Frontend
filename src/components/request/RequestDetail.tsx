"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequest } from "@/hook";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { UserRole } from "@/types/auth.type";
import { AdminActions } from "./AdminActions";
import { AttachmentGallery } from "./AttachmentGallery";
import { CitizenActions } from "./CitizenActions";
import { FeedbackCard } from "./FeedbackCard";
import { LocationPreview } from "./LocationPreview";
import { RequestTimeline } from "./RequestTimeline";
import { StaffActions } from "./StaffActions";
import { RequestDetailSkeleton } from "./skeletons";

type Props = { id: string; userRole: UserRole; backHref: string };

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

export function RequestDetail({ id, userRole, backHref }: Props) {
  const { data, isLoading, isError, error, refetch } = useRequest(id);

  if (isLoading) return <RequestDetailSkeleton />;
  if (isError || !data) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const r = data.data;
  const attachments = r.attachments ?? [];
  const evidence = attachments.filter((a) => a.type === "EVIDENCE");
  const proof = attachments.filter((a) => a.type === "RESOLUTION_PROOF");
  const lat = Number(r.latitude);
  const lng = Number(r.longitude);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
  const staff = r.assignedStaff;

  return (
    <div>
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to requests
      </Link>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-muted-foreground">
            {r.trackingRef}
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {r.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={r.status} />
          {r.isOverdue && <Badge variant="destructive">Overdue</Badge>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm leading-6 whitespace-pre-line">
                {r.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{r.address}</p>
                  {hasCoords && (
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-1 text-xs text-primary underline-offset-4 hover:underline"
                    >
                      Open map <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
                {hasCoords && (
                  <LocationPreview latitude={lat} longitude={lng} />
                )}
              </div>

              <AttachmentGallery title="Evidence" attachments={evidence} />
              <AttachmentGallery title="Resolution proof" attachments={proof} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <RequestTimeline request={r} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y">
                <DetailRow label="Service">{r.category?.name ?? "—"}</DetailRow>
                <DetailRow label="Department">
                  {r.department?.name ?? "—"}
                </DetailRow>
                <DetailRow label="Fee">
                  {r.feeCharged ? formatCurrency(r.feeCharged) : "Free"}
                </DetailRow>
                <DetailRow label="Filed">
                  {formatDateTime(r.createdAt)}
                </DetailRow>
                <DetailRow label="Due by">
                  {formatDateTime(r.slaDueAt)}
                </DetailRow>
                {r.resolvedAt && (
                  <DetailRow label="Resolved">
                    {formatDateTime(r.resolvedAt)}
                  </DetailRow>
                )}
                <DetailRow label="Assigned to">
                  {staff
                    ? (staff.staffProfile?.fullName ?? staff.email)
                    : "Not yet assigned"}
                </DetailRow>
                {userRole !== "CITIZEN" && r.citizen && (
                  <DetailRow label="Citizen">
                    {r.citizen.citizenProfile?.fullName ?? r.citizen.email}
                  </DetailRow>
                )}
              </dl>
            </CardContent>
          </Card>

          {userRole === "CITIZEN" && (
            <>
              <CitizenActions request={r} />
              <FeedbackCard request={r} />
            </>
          )}
          {userRole === "STAFF" && <StaffActions request={r} />}
          {userRole === "ADMIN" && <AdminActions request={r} />}
        </div>
      </div>
    </div>
  );
}
