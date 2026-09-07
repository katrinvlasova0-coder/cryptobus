import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface ArticleNotification {
  slug: string;
  titleDe: string;
  titleEn: string;
  cluster: string;
  keywordDe: string;
  searchVolDe: number;
  wordCountDe: number;
  wordCountEn: number;
  faqCount: number;
  publishedDate: string;
  coverImage: string;
  descriptionDe: string;
  isFallback?: boolean;
  fallbackReason?: string;
}

export async function sendArticleNotification(
  article: ArticleNotification,
): Promise<void> {
  if (!resend || !process.env.NOTIFY_EMAIL) {
    console.log('ℹ️ Email notification skipped (RESEND_API_KEY or NOTIFY_EMAIL not set)');
    return;
  }

  const baseUrl = process.env.SITE_BASE_URL || 'https://cryp2bus.com';
  const articleUrl = `${baseUrl}/blog/${article.slug}/`;
  const fromEmail = process.env.FROM_EMAIL || 'Hello@cryp2bus.com';
  const title = article.titleEn || article.titleDe;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New article published</title>
</head>
<body style="margin:0;padding:0;background:#0B1224;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B1224;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111936;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:#00001a;padding:28px 32px;">
              <p style="margin:0;color:#00ff9d;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">CRYP2BUS — CONTENT UPDATE</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:20px;font-weight:700;">${
                article.isFallback ? 'Fallback article published' : 'New article published'
              }</h1>
            </td>
          </tr>
          ${
            article.coverImage
              ? `<tr><td><img src="${article.coverImage}" alt="${title}" style="width:100%;height:220px;object-fit:cover;display:block;" /></td></tr>`
              : ''
          }
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;color:#0066ff;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${article.cluster}</p>
              <h2 style="margin:0 0 16px;color:#F0F4FF;font-size:22px;font-weight:700;line-height:1.3;">${title}</h2>
              <p style="margin:0 0 24px;color:#9CA3C4;font-size:15px;line-height:1.6;">${article.descriptionDe}</p>
              ${
                article.isFallback
                  ? `<p style="margin:0 0 24px;padding:12px 14px;background:#3F2A00;border-radius:8px;color:#FDE68A;font-size:13px;line-height:1.5;"><strong>Fallback:</strong> planned generation produced no valid article. A reviewed educational briefing was published instead. The original queue item stays open. ${article.fallbackReason ? `<br>${article.fallbackReason}` : ''}</p>`
                  : ''
              }
              <p style="margin:0 0 8px;color:#9CA3C4;font-size:13px;">Words: <strong style="color:#F0F4FF;">${article.wordCountDe.toLocaleString('en-US')}</strong> · FAQ: <strong style="color:#F0F4FF;">${article.faqCount}</strong></p>
              <p style="margin:0 0 28px;color:#9CA3C4;font-size:13px;">Keyword: ${article.keywordDe}</p>
              <a href="${articleUrl}" style="display:inline-block;background:#0066ff;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 28px;border-radius:4px;">Open article</a>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:#00001a;border-top:1px solid #1E293B;">
              <p style="margin:0;color:#64748B;font-size:12px;text-align:center;">
                Cryptobus Content Factory · ${baseUrl}/blog/
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const { data, error } = await resend.emails.send({
    from: `Cryptobus Content Factory <${fromEmail}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: article.isFallback ? `Fallback published: ${title}` : `New article: ${title}`,
    html,
  });

  if (error) {
    console.error('❌ Resend API error:', error);
    throw new Error(`Resend failed: ${error.message}`);
  }

  console.log(`📧 Email notification sent to ${process.env.NOTIFY_EMAIL} (id: ${data?.id ?? 'n/a'})`);
}
