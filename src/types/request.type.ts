export type RequestStatus =
  | "PENDING_PAYMENT"
  | "SUBMITTED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED";

export type ServiceRequest = {
  id: string;
  trackingRef: string;
  title: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  status: RequestStatus;
  isOverdue: boolean;
  createdAt?: string;
  updatedAt?: string;
};
