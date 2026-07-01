import { brand } from "@/lib/brand-vocabulary";
import { getFromEmail, getResend, getSiteUrl } from "@/lib/email/resend";

function nextBeaconBulletinMonth() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function welcomeEmailHtml() {
  const siteUrl = getSiteUrl();
  const nextIssue = nextBeaconBulletinMonth();

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Welcome to the Crew</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f7fb;font-family:Georgia,'Times New Roman',serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #dbe4f0;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#001f3f;padding:28px 32px;">
                <p style="margin:0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#f5c542;font-family:Arial,sans-serif;">
                  ${brand.siteName}
                </p>
                <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;color:#ffffff;font-weight:600;">
                  Welcome aboard, Crew member.
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#334155;">
                  Thanks for joining the crew. Each month we send the <strong>Beacon Bulletin</strong> with Bright Beacons from the directory, seasonal homeschool guidance, and a few new routes worth charting.
                </p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#334155;">
                  Your first bulletin arrives in <strong>${nextIssue}</strong>. Until then, you can start browsing trusted resources anytime.
                </p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#334155;">
                  When you are ready for deeper navigation, ${brand.pricing.premiumTeaser.toLowerCase()} with ${brand.pricing.yearlyLabel} at ${brand.pricing.yearly}.
                </p>
                <a href="${siteUrl}/browse" style="display:inline-block;background:#f5c542;color:#001f3f;text-decoration:none;font-family:Arial,sans-serif;font-size:15px;font-weight:700;padding:12px 20px;border-radius:999px;">
                  Chart your course
                </a>
                <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#64748b;">
                  Prefer premium tools now?
                  <a href="${siteUrl}/pricing" style="color:#001f3f;">See Lighthouse Premium</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;font-family:Arial,sans-serif;">
                  You are receiving this because you signed up at ${siteUrl}. We send one monthly bulletin, not weekly spam.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

export async function sendWelcomeNewsletterEmail(email: string) {
  const resend = getResend();
  if (!resend) {
    return { sent: false as const, reason: "resend_not_configured" as const };
  }

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: email,
    subject: `Welcome to the crew — your Beacon Bulletin starts in ${nextBeaconBulletinMonth()}`,
    html: welcomeEmailHtml(),
  });

  if (error) {
    console.error("Failed to send welcome newsletter email:", error);
    return { sent: false as const, reason: "send_failed" as const, error };
  }

  return { sent: true as const };
}
