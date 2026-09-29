import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPayment, getPayments, initiatePayment, refundPayment } from "@/api";

export function useInitiatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initiatePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
    },
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => getPayment(id),
    enabled: !!id,
  });
}

export function usePayments(params?: Parameters<typeof getPayments>[0]) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getPayments(params),
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload?: Parameters<typeof refundPayment>[1];
    }) => refundPayment(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["payment", variables.id],
      });
    },
  });
}
