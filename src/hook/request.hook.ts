import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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

/** One place that knows which caches a request mutation makes stale. */
function useInvalidateRequests() {
  const queryClient = useQueryClient();

  return (id?: string, opts: { payments?: boolean } = {}) => {
    queryClient.invalidateQueries({ queryKey: ["requests"] });
    queryClient.invalidateQueries({ queryKey: ["request-search"] });
    if (id) queryClient.invalidateQueries({ queryKey: ["request", id] });
    if (opts.payments) queryClient.invalidateQueries({ queryKey: ["payments"] });
  };
}

export function useCreateServiceRequest() {
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: ({
      formData,
      onProgress,
    }: {
      formData: FormData;
      onProgress?: (percent: number) => void;
    }) => createServiceRequest(formData, onProgress),
    onSuccess: () => invalidate(),
  });
}

export function useRequests(
  params?: Parameters<typeof getRequests>[0],
  enabled = true,
) {
  return useQuery({
    queryKey: ["requests", params],
    queryFn: () => getRequests(params),
    enabled,
    placeholderData: keepPreviousData,
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
    placeholderData: keepPreviousData,
  });
}

export function useCancelRequest() {
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: cancelRequest,
    onSuccess: (_, id) => invalidate(id),
  });
}

export function useUpdateRequestStatus() {
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof updateRequestStatus>[1];
    }) => updateRequestStatus(id, payload),
    onSuccess: (_, variables) => invalidate(variables.id),
  });
}

export function useReassignRequest() {
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof reassignRequest>[1];
    }) => reassignRequest(id, payload),
    onSuccess: (_, variables) => invalidate(variables.id),
  });
}

export function useReopenRequest() {
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof reopenRequest>[1];
    }) => reopenRequest(id, payload),
    onSuccess: (_, variables) => invalidate(variables.id),
  });
}

export function useAddRequestAttachments() {
  const invalidate = useInvalidateRequests();

  return useMutation({
    mutationFn: ({
      id,
      formData,
      onProgress,
    }: {
      id: string;
      formData: FormData;
      onProgress?: (percent: number) => void;
    }) => addRequestAttachments(id, formData, onProgress),
    onSuccess: (_, variables) => invalidate(variables.id),
  });
}
