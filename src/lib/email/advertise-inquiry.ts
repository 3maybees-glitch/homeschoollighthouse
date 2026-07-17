import { brand } from "@/lib/brand-vocabulary";
import { getFromEmail, getResend, getSiteUrl } from "@/lib/email/resend";

export type AdvertiseInquiry = {
  businessName: string;
  contactName: string;
  email: string;
  website?: string;
  plan: "monthly" | "yearly" | "upsell";
  message?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inquiryEmailHtml(inquiry: AdvertiseInquiry) {
  const siteUrl = getSiteUrl();
  const planLabel =
    inquiry.plan === "yearly"
      ? brand.advertise.yearly
      : inquiry.plan === "upsell"
        ? "Custom / upsell package"
        : brand.advertise.monthly;

  return `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:24px;font-family:Arial,sans-serif;color:#0f172a;background:#f4f7fb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #dbe4f0;border-radius:16px;">
      <tr>
        <td style="background:#001f3f;padding:24px 28px;">
          <p style="margin:0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#f5c542;">
            ${escapeHtml(brand.siteName)}
          </p>
          <h1 style="margin:8px 0 0;font-size:22px;color:#ffffff;">Bright Beacon inquiry</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;">
          <p style="margin:0 0 12px;"><strong>Business:</strong> ${escapeHtml(inquiry.businessName)}</p>
          <p style="margin:0 0 12px;"><strong>Contact:</strong> ${escapeHtml(inquiry.contactName)}</p>
          <p style="margin:0 0 12px;"><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
          <p style="margin:0 0 12px;"><strong>Website:</strong> ${escapeHtml(inquiry.website || "—")}</p>
          <p style="margin:0 0 12px;"><strong>Plan interest:</strong> ${escapeHtml(planLabel)}</p>
          <p style="margin:0 0 12px;"><strong>Message:</strong><br />${escapeHtml(inquiry.message || "—").replaceAll("\n", "<br />")}</p>
          <p style="margin:20px 0 0;font-size:13px;color:#64748b;">
            Submitted from <a href="${siteUrl}/advertise" style="color:#001f3f;">${siteUrl}/advertise</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export async function sendAdvertiseInquiryEmail(inquiry: AdvertiseInquiry) {
  const resend = getResend();
  const notifyTo = process.env.ADVERTISE_INQUIRY_EMAIL ?? process.env.OWNER_PREMIUM_EMAILS?.split(",")[0]?.trim();

  if (!resend || !notifyTo) {
    return {
      sent: false as const,
      reason: !resend ? "RESEND_API_KEY missing" : "No inquiry recipient configured",
    };
  }

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: notifyTo,
    replyTo: inquiry.email,
    subject: `Bright Beacon inquiry: ${inquiry.businessName}`,
    html: inquiryEmailHtml(inquiry),
  });

  if (error) {
    return { sent: false as const, reason: error.message };
  }

  return { sent: true as const };
}
