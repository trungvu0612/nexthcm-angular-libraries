export interface ResetPasswordPayload {
  userId: string;
  token: string;
  newPassword: string;
  confirmPassword?: string;
}
