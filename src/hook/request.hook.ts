import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addRequestAttachments,
  cancelRequest,
  createServiceRequest,
  getRequest,
  getRequests,
  reassignRequest,
  reopenRequest,
  searchRequests,
  updateRequestStatus,
} from "@/api";

export function useCreateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
    },
  });
}

export function useRequests(params?: Parameters<typeof getRequests>[0]) {
  return useQuery({
    queryKey: ["requests", params],
    queryFn: () => getRequests(params),
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: ["request", id],
    queryFn: () => getRequest(id),
    enabled: !!id,
  });
}

export function useSearchRequests(
  params: Parameters<typeof searchRequests>[0],
) {
  return useQuery({
    queryKey: ["request-search", params],
    queryFn: () => searchRequests(params),
    enabled: !!params.q,
  });
}

export function useCancelRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelRequest,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["request", id],
      });
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof updateRequestStatus>[1];
    }) => updateRequestStatus(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["request", variables.id],
      });
    },
  });
}

export function useReassignRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof reassignRequest>[1];
    }) => reassignRequest(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["request", variables.id],
      });
    },
  });
}

export function useReopenRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof reopenRequest>[1];
    }) => reopenRequest(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["request", variables.id],
      });
    },
  });
}

export function useAddRequestAttachments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      addRequestAttachments(id, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["request", variables.id],
      });
    },
  });
}
