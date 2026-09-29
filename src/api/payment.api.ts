import apiClient from "@/lib/apiClient";

export function initiatePayment(payload: {
  requestId: string;
  provider: "SSLCOMMERZ" | "BKASH";
}) {
  return apiClient("/payments/initiate", {
    method: "POST",
    body: payload,
  });
}

export function getPayment(id: string) {
  return apiClient(`/payments/${id}`, {
    method: "GET",
  });
}

export function getPayments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  provider?: string;
  sortBy?: "createdAt" | "amount" | "status";
  sortOrder?: "asc" | "desc";
}) {
  return apiClient("/payments", {
    method: "GET",
    query: params,
  });
}

export function refundPayment(
  id: string,
  payload?: {
    reason?: string;
  },
) {
  return apiClient(`/payments/${id}/refund`, {
    method: "PATCH",
    body: payload,
  });
}