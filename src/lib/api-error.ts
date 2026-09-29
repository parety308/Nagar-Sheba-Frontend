import type { FetchError } from "ofetch";
import type { ApiErrorBody, ApiErrorItem } from "@/types/api.type";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  const err = error as FetchError<ApiErrorBody>;
  return err?.data?.message ?? fallback;
}

export function getApiFieldErrors(error: unknown): ApiErrorItem[] {
  const err = error as FetchError<ApiErrorBody>;
  return err?.data?.errors ?? [];
}