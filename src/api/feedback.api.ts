import apiClient from "@/lib/apiClient";

export function createFeedback(payload: {
  requestId: string;
  rating: number;
  comment?: string;
}) {
  return apiClient("/feedbacks", {
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
  return apiClient("/feedbacks", {
    method: "GET",
    query: params,
  });
}

export function getFeedback(requestId: string) {
  return apiClient(`/feedbacks/${requestId}`, {
    method: "GET",
  });
}