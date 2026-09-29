import apiClient from "@/lib/apiClient";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from "@/types/auth.type";

export function userRegister(payload: RegisterPayload) {
  return apiClient("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function verifyEmail(payload: VerifyEmailPayload) {
  return apiClient("/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function userLogin(payload: LoginPayload) {
  return apiClient("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function googleLogin(idToken: string) {
  return apiClient("/auth/google-login", {
    method: "POST",
    body: { idToken },
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export function userProfile() {
  return apiClient("/auth/me", {
    method: "GET",
  });
}

export function updateProfile(payload: Record<string, string>) {
  return apiClient("/auth/me", {
    method: "PATCH",
    body: payload,
  });
}

export function refreshToken(refreshToken?: string) {
  return apiClient("/auth/refresh-token", {
    method: "POST",
    body: refreshToken ? { refreshToken } : undefined,
  });
}

export function userLogOut() {
  return apiClient("/auth/logout", {
    method: "POST",
  });
}
