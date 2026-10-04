import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import type { Payment } from "@/types/payment.type";
import type { PaymentSession } from "@/types/request.type";

export function initiatePayment(payload: {
  requestId: string;
  provider: "SSLCOMMERZ" | "BKASH";
}) {
  return apiClient<ApiResponse<PaymentSession>>("/payments/initiate", {
    method: "POST",
    body: payload,
  });
}

export function getPayment(id: string) {
  return apiClient<ApiResponse<Payment>>(`/payments/${id}`, {
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
  return apiClient<ApiResponse<Payment[]>>("/payments", {
    method: "GET",
    query: params,
  });
}

export function refundPayment(id: string, payload?: { reason?: string }) {
  return apiClient<ApiResponse<Payment>>(`/payments/${id}/refund`, {
    method: "PATCH",
    body: payload,
  });
}

export function downloadPaymentReceipt(id: string) {
  return apiClient<Blob>(`/payments/${id}/receipt`, {
    method: "GET",
    responseType: "blob",
  });
}