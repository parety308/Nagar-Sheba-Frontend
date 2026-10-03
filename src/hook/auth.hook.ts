import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  forgotPassword,
  googleLogin,
  refreshToken,
  resetPassword,
  updateProfile,
  updateProfileImage,
  userLogin,
  userLogOut,
  userProfile,
  userRegister,
  verifyEmail,
} from "@/api";
import type { LoginPayload } from "@/types/auth.type";
import type { AuthUser } from "@/types/user.type";

export const USER_QUERY_KEY = ["user"] as const;

/** Logs in, then loads /auth/me so callers know the role for redirecting. */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      await userLogin(payload);
      const { data } = await userProfile();
      return data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData<AuthUser | null>(USER_QUERY_KEY, user);
    },
  });
}

export function useRegister() {
  return useMutation({ mutationFn: userRegister });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useGoogleLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (idToken: string) => {
      await googleLogin(idToken);
      const { data } = await userProfile();
      return data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData<AuthUser | null>(USER_QUERY_KEY, user);
    },
  });
}
export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}

export function useRefreshToken() {
  return useMutation({ mutationFn: refreshToken });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useLogOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogOut,
    onSuccess: () => {
      queryClient.setQueryData<AuthUser | null>(USER_QUERY_KEY, null);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== USER_QUERY_KEY[0],
      });
    },
  });
}

/** Current user (unwrapped from the API envelope). Undefined/null = logged out. */
export function useProfile() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async (): Promise<AuthUser | null> => (await userProfile()).data,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      // clears the "temporary password" banner
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}

export function useUpdateProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}
