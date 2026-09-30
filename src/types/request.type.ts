export type RequestStatus =
  | "PENDING_PAYMENT"
  | "SUBMITTED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED";

export type AttachmentType = "EVIDENCE" | "RESOLUTION_PROOF";

export type Attachment = {
  id: string;
  requestId: string;
  uploadedBy: string;
  url: string;
  type: AttachmentType;
  createdAt: string;
};

export type StatusHistoryItem = {
  id: string;
  requestId: string;
  fromStatus: RequestStatus | null;
  toStatus: RequestStatus;
  changedBy: string;
  note: string | null;
  createdAt: string;
};

export type PersonRef = {
  id: string;
  email: string;
  citizenProfile?: { fullName: string } | null;
  staffProfile?: { fullName: string } | null;
};

export type ServiceRequest = {
  id: string;
  trackingRef: string;
  citizenId: string;
  categoryId: string;
  departmentId: string;
  assignedStaffId: string | null;
  title: string;
  description: string;
  address: string;
  latitude: string | number; // Prisma Decimal serializes as string
  longitude: string | number;
  status: RequestStatus;
  feeCharged: string | null;
  slaDueAt: string | null;
  isOverdue: boolean;
  resolvedAt: string | null;
  closedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    feeType?: "FREE" | "PAID";
    slaHours?: number;
  };
  department?: { id: string; name: string };
  attachments?: Attachment[];
  statusHistory?: StatusHistoryItem[];
  citizen?: PersonRef;
  assignedStaff?: PersonRef | null;
};

export type PaymentSession = { paymentId: string; checkoutUrl: string };

export type CreateRequestResult = ServiceRequest & {
  paymentSession: PaymentSession | null;
};
