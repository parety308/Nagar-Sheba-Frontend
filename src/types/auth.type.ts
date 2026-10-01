export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
};

export type UserRole = "CITIZEN" | "STAFF" | "ADMIN";

export type AccountStatus = "ACTIVE" | "BLOCKED";

export type AuthProvider = "CREDENTIAL" | "GOOGLE";

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
