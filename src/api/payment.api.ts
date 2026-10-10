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
  return apiClient<Blob, "blob">(`/payments/${id}/receipt`, {
    method: "GET",
    responseType: "blob",
  });
}



// https://www.emailjs.com/

// Programming Hero level 2
// 6:56 PM
// await fetch("https://api.emailjs.com/api/v1.0/email/send", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     service_id: "YOUR_SERVICE_ID",
//     template_id: "YOUR_TEMPLATE_ID",
//     user_id: "YOUR_PUBLIC_KEY",
//     template_params: {
//       to_email: "anyone@example.com",
//       message: "It works!",
//     },
//   }),
// });