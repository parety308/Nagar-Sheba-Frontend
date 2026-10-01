import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import type { Feedback } from "@/types/feedback.type";

export function createFeedback(payload: {
  requestId: string;
  rating: number;
  comment?: string;
}) {
  return apiClient<ApiResponse<Feedback>>("/feedbacks", {
    method: "POST",
    body: payload,
  });
}

export function getFeedbacks(params?: {
  page?: number;
  limit?: number;
  rating?: number;
  departmentId?: string;
}) {
  return apiClient<ApiResponse<Feedback[]>>("/feedbacks", {
    method: "GET",
    query: params,
  });
}

export function getFeedback(requestId: string) {
  return apiClient<ApiResponse<Feedback>>(`/feedbacks/${requestId}`, {
    method: "GET",
  });
}
