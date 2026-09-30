export type PaymentProvider = "SSLCOMMERZ" | "BKASH";

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type Payment = {
  id: string;
  requestId: string;
  provider: PaymentProvider;
  providerRef: string;
  amount: string;
  status: PaymentStatus;
  paidAt: string | null;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
  request?: { id: string; trackingRef: string; title: string };
};