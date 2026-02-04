export interface RegisterResponseDTO {
  email: string;
  userId: string;
  message: string;
  /**
   * Dev-only helper: auth-service returns the verification token so you can verify email without a mail provider.
   */
  verificationToken?: string;
}
