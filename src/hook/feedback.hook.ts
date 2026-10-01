import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FetchError } from "ofetch";
import { createFeedback, getFeedback, getFeedbacks } from "@/api";

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFeedback,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      queryClient.invalidateQueries({
        queryKey: ["feedback", variables.requestId],
      });
    },
  });
}

export function useFeedbacks(params?: Parameters<typeof getFeedbacks>[0]) {
  return useQuery({
    queryKey: ["feedbacks", params],
    queryFn: () => getFeedbacks(params),
  });
}

/** Resolves to null when the request has no feedback yet (API returns 404). */
export function useFeedback(requestId: string, enabled = true) {
  return useQuery({
    queryKey: ["feedback", requestId],
    enabled: enabled && !!requestId,
    retry: false,
    queryFn: async () => {
      try {
        return (await getFeedback(requestId)).data;
      } catch (error) {
        if ((error as FetchError).statusCode === 404) return null;
        throw error;
      }
    },
  });
}
