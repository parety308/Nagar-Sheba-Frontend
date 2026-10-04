import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from "@/types/auth.type";
import type { AuthTokens, AuthUser } from "@/types/user.type";

export function userRegister(payload: RegisterPayload) {
  return apiClient<ApiResponse<null>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function verifyEmail(payload: VerifyEmailPayload) {
  return apiClient<
    ApiResponse<{ user: Pick<AuthUser, "id" | "email" | "role" | "status"> }>
  >("/auth/verify-email", { method: "POST", body: payload });
}

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function googleLogin(idToken: string) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/google-login", {
    method: "POST",
    body: { idToken },
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export function userProfile() {
  return apiClient<ApiResponse<AuthUser>>("/auth/me", { method: "GET" });
}

export function updateProfile(payload: Record<string, string>) {
  return apiClient<ApiResponse<Pick<AuthUser, "id" | "email">>>("/auth/me", {
    method: "PATCH",
    body: payload,
  });
}

export function updateProfileImage(formData: FormData) {
  // field name must be "profileImage" (image/*, max 5MB)
  return apiClient<ApiResponse<{ id: string; profileImage: string }>>(
    "/auth/me/profile-image",
    { method: "PATCH", body: formData },
  );
}

export function refreshToken(refreshToken?: string) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/refresh-token", {
    method: "POST",
    body: refreshToken ? { refreshToken } : undefined,
  });
}

export function userLogOut() {
  return apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });
}

export function changePassword(payload: ChangePasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/change-password", {
    method: "POST",
    body: payload,
  });
}

export function resendVerificationOtp(payload: { email: string }) {
  return apiClient<ApiResponse<null>>("/auth/resend-otp", {
    method: "POST",
    body: payload,
  });
}