import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

try {
  dotenv.config();
} catch (e) {}

/**
 * Send official Student Project Registration & Badge Access Email
 * Strictly in clean, standard email format with exact user-specified text.
 * No attachments, no extra blocks.
 */
export function cleanRecipientEmail(raw) {
  if (!raw) return '';
  let email = String(raw).trim().toLowerCase();
  // Fix accidental double domain like name@college.edu.in@gmail.com
  if ((email.match(/@/g) || []).length > 1) {
    if (email.endsWith('@gmail.com')) {
      const trimmed = email.slice(0, -'@gmail.com'.length);
      if ((trimmed.match(/@/g) || []).length === 1) {
        return trimmed;
      }
    }
  }
  return email;
}

export async function sendStudentRegistrationEmail({
  toEmail,
  studentName,
  projectTitle,
  college,
  domain,
  dept,
  year,
  registrationId,
  shareToken,
  securityPin,
}) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;

  const targetEmail = cleanRecipientEmail(toEmail);
  if (!targetEmail) {
    console.warn('[student-email] No recipient email specified.');
    return { success: false, reason: 'missing_email' };
  }

  // Base URL for links
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pibiopenintelligence.com';
  const collectBadgeUrl = `${baseUrl}/registered-students?regId=${encodeURIComponent(registrationId)}`;

  // EXACT PLAIN TEXT VERSION AS SPECIFIED BY USER
  const plainTextContent = `Hi ${studentName},

Congratulations! 🎉

Your student innovation project has been successfully submitted and confirmed for the PiBi Open Intelligence – Student Project Awards 2026.

Your badge is now ready to access. Please follow the steps below to view and access your badge.

How to Access Your Badge

1. Open the Access URL: ${collectBadgeUrl}
2. Select Your Project: Once the URL opens, navigate to your project and click on the Badge section.
3. Enter Your 4-Digit PIN: Enter the PIN provided below when prompted.
4. View Your Badge: Once your PIN is verified, you can access your badge.

Your Badge Details

- Project Name: ${projectTitle}
- Badge Access URL: ${collectBadgeUrl}
- Your 4-Digit PIN: ${securityPin}

Please keep your PIN confidential and do not share it with others.

If you experience any difficulties accessing your badge, please contact us for assistance.

Thank you for participating in the PiBi Open Intelligence – Student Project Awards 2026. We congratulate you on your achievement and wish you continued success in your innovation journey!

Best regards,  
PiBi Open Intelligence Team  
PiBi Open Intelligence – Student Project Awards 2026`;

  // CLEAN STANDARD HTML VERSION (LIKE SCREENSHOT 2)
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Your Badge is Ready - PiBi Open Intelligence</title>
    </head>
    <body style="font-family: Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; line-height: 1.6; color: #1f2937; background-color: #ffffff; margin: 0; padding: 24px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <p style="margin: 0 0 16px 0;">Hi <strong>${escapeHtml(studentName)}</strong>,</p>

        <p style="margin: 0 0 16px 0;"><strong>Congratulations!</strong> 🎉</p>

        <p style="margin: 0 0 16px 0;">Your student innovation project has been successfully submitted and confirmed for the <strong>PiBi Open Intelligence – Student Project Awards 2026.</strong></p>

        <p style="margin: 0 0 20px 0;">Your badge is now ready to access. Please follow the steps below to view and access your badge.</p>

        <p style="margin: 0 0 10px 0;"><strong>How to Access Your Badge</strong></p>

        <ol style="margin: 0 0 20px 0; padding-left: 22px; line-height: 1.8;">
          <li style="margin-bottom: 8px;"><strong>Open the Access URL:</strong> <a href="${collectBadgeUrl}" style="color: #0284c7; text-decoration: underline; word-break: break-all;">${collectBadgeUrl}</a></li>
          <li style="margin-bottom: 8px;"><strong>Select Your Project:</strong> Once the URL opens, navigate to your project and click on the <strong>Badge</strong> section.</li>
          <li style="margin-bottom: 8px;"><strong>Enter Your 4-Digit PIN:</strong> Enter the PIN provided below when prompted.</li>
          <li style="margin-bottom: 8px;"><strong>View Your Badge:</strong> Once your PIN is verified, you can access your badge.</li>
        </ol>

        <p style="margin: 0 0 10px 0;"><strong>Your Badge Details</strong></p>

        <ul style="margin: 0 0 20px 0; padding-left: 22px; line-height: 1.8; list-style-type: disc;">
          <li style="margin-bottom: 6px;"><strong>Project Name:</strong> ${escapeHtml(projectTitle)}</li>
          <li style="margin-bottom: 6px;"><strong>Badge Access URL:</strong> <a href="${collectBadgeUrl}" style="color: #0284c7; text-decoration: underline; word-break: break-all;">${collectBadgeUrl}</a></li>
          <li style="margin-bottom: 6px;"><strong>Your 4-Digit PIN:</strong> <span style="font-family: monospace; font-size: 16px; font-weight: bold; background-color: #f1f5f9; padding: 2px 8px; border-radius: 4px; border: 1px solid #cbd5e1;">${escapeHtml(securityPin)}</span></li>
        </ul>

        <p style="margin: 0 0 16px 0;">Please keep your PIN confidential and do not share it with others.</p>

        <p style="margin: 0 0 16px 0;">If you experience any difficulties accessing your badge, please contact us for assistance.</p>

        <p style="margin: 0 0 24px 0;">Thank you for participating in the <strong>PiBi Open Intelligence – Student Project Awards 2026.</strong> We congratulate you on your achievement and wish you continued success in your innovation journey!</p>

        <p style="margin: 0 0 4px 0;">Best regards,</p>
        <p style="margin: 0 0 2px 0;"><strong>PiBi Open Intelligence Team</strong></p>
        <p style="margin: 0; color: #64748b; font-size: 14px;">PiBi Open Intelligence – Student Project Awards 2026</p>
      </div>
    </body>
    </html>
  `;

  const fromEmail = process.env.SMTP_FROM_EMAIL || 'openintelligencepibi@gmail.com';

  if (SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST || 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"PiBi Open Intelligence" <${fromEmail}>`,
        replyTo: fromEmail,
        to: targetEmail,
        subject: `🎉 Congratulations! Your PiBi Builder Badge is Ready [${registrationId}]`,
        text: plainTextContent,
        html: htmlContent,
        attachments: [], // NO ATTACHMENTS
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[student-email] Confirmation email successfully sent to ${targetEmail} from ${fromEmail}. Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId, recipient: targetEmail };
    } catch (err) {
      console.error('[student-email] Error sending email via SMTP:', err);
      return { success: false, error: err.message };
    }
  } else {
    console.log(`\n=================================================`);
    console.log(`📧 MOCK STUDENT EMAIL`);
    console.log(`To: ${targetEmail}`);
    console.log(`Student: ${studentName}`);
    console.log(`PIN: ${securityPin}`);
    console.log(`=================================================\n`);
    return { success: true, mock: true };
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
