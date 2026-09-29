export type PaymentProvider = "SSLCOMMERZ" | "BKASH";

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type Payment = {
  id: string;
  provider: PaymentProvider;
  amount: string;
  status: PaymentStatus;
};
