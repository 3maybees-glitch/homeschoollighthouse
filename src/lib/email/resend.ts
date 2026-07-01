import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export function getFromEmail() {
  return (
    process.env.RESEND_FROM_EMAIL ?? "Homeschool Lighthouse <beacon@resend.dev>"
  );
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://homeschoollighthouse.com";
}
