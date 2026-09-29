import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  googleLogin,
  refreshToken,
  resetPassword,
  updateProfile,
  userLogin,
  userLogOut,
  userProfile,
  userRegister,
  verifyEmail,
} from "@/api";

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: userRegister,
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: googleLogin,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: refreshToken,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
}

export function useLogOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogOut,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["user"],
      });
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["user"],
    queryFn: userProfile,
    retry: false,
  });
}
