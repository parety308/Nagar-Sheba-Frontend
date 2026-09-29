import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFeedback, getFeedback, getFeedbacks } from "@/api";

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFeedback,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["feedbacks"],
      });
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

export function useFeedback(requestId: string) {
  return useQuery({
    queryKey: ["feedback", requestId],
    queryFn: () => getFeedback(requestId),
    enabled: !!requestId,
  });
}
