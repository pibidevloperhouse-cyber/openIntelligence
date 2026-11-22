import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { makeProjectVoteToken } from './project-vote-links.js';

try {
  dotenv.config();
} catch (e) {}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function generateVotingEmailHtml({
  studentName,
  projectTitle,
  institution,
  registrationId,
  voteUrl,
  showcaseUrl,
}) {
  const safeStudentName = escapeHtml(studentName || 'Student Innovator');
  const safeProjectTitle = escapeHtml(projectTitle || 'Your Innovation Project');
  const safeInstitution = escapeHtml(institution || 'Your Institution');
  const safeRegId = escapeHtml(registrationId || 'PIBI-2026');
  const safeVoteUrl = escapeHtml(voteUrl);
  const safeShowcaseUrl = escapeHtml(showcaseUrl);

  const whatsappShareText = encodeURIComponent(
    `Hey everyone! 👋 Our student project "${projectTitle}" has been shortlisted for the PiBi Open Intelligence Awards 2026! 🚀\n\nPlease support our team by casting your vote here: ${voteUrl}\n\nEvery vote matters! Thank you for your support! 🙏`
  );
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${whatsappShareText}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voting is Officially Live! — PiBi Open Intelligence</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">

  <!-- Outer Container -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        
        <!-- Main Card -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0a192f 0%, #1f6fb2 60%, #2ec4b6 100%); padding: 36px 32px 32px; text-align: center;">
              
              <!-- Badge -->
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 14px;">
                <tr>
                  <td style="background-color: rgba(255, 255, 255, 0.18); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 30px; padding: 5px 16px; font-size: 12px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">
                    🗳️ Phase 2: Public Voting is Live
                  </td>
                </tr>
              </table>

              <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 26px; font-weight: 800; line-height: 1.25; letter-spacing: -0.5px;">
                Your Project is Ready for Voting!
              </h1>
              <p style="margin: 0; color: rgba(255, 255, 255, 0.92); font-size: 14px; font-weight: 500;">
                PiBi Open Intelligence – Student Project Awards 2026
              </p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px 32px 24px;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #0f172a;">
                Hi <strong>${safeStudentName}</strong>,
              </p>

              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.65; color: #334155;">
                Great news! <strong>Public Voting has officially started</strong> on PiBi Open Intelligence. Your project is now featured live on our showcase hub, and it’s time to gather maximum community support!
              </p>

              <!-- Project Highlight Card -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 14px; border: 1px solid #cbd5e1; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #1f6fb2; letter-spacing: 0.8px; margin-bottom: 6px;">
                      Featured Project Details
                    </div>
                    <div style="font-size: 17px; font-weight: 800; color: #0f172a; margin-bottom: 6px; line-height: 1.35;">
                      ${safeProjectTitle}
                    </div>
                    <div style="font-size: 13px; color: #64748b; line-height: 1.5;">
                      🏫 <strong>College:</strong> ${safeInstitution}<br>
                      🏷️ <strong>Reg ID:</strong> <span style="font-family: monospace; font-weight: 600; color: #0f172a;">${safeRegId}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Primary CTA Button -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a href="${safeVoteUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #1f6fb2 0%, #2ec4b6 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; padding: 15px 36px; border-radius: 12px; box-shadow: 0 4px 14px rgba(31, 111, 178, 0.35); text-align: center;">
                      🗳️ Cast Your Vote Now &rarr;
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <span style="font-size: 12px; color: #64748b;">
                      Direct Voting Link: <a href="${safeVoteUrl}" style="color: #1f6fb2; text-decoration: underline; word-break: break-all;">${safeVoteUrl}</a>
                    </span>
                  </td>
                </tr>
              </table>

              <!-- How to Gather Votes -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #0f172a;">
                  🚀 Share with Friends, Family & Peers to Win!
                </h3>
                <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                  Every single vote increases your project's popularity score! The more people vote for your innovation, the stronger your chance of making it to the <strong>Top 10 Finalists</strong>.
                </p>

                <!-- Steps List -->
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="28" valign="top" style="font-size: 16px;">👥</td>
                    <td style="padding-bottom: 12px; font-size: 14px; line-height: 1.5; color: #334155;">
                      <strong>Friends & Family:</strong> Share your voting link with your family groups, friends, and college peers.
                    </td>
                  </tr>
                  <tr>
                    <td width="28" valign="top" style="font-size: 16px;">💬</td>
                    <td style="padding-bottom: 12px; font-size: 14px; line-height: 1.5; color: #334155;">
                      <strong>WhatsApp Groups & Status:</strong> Post your project demo link on your class groups, clubs, and WhatsApp status.
                    </td>
                  </tr>
                  <tr>
                    <td width="28" valign="top" style="font-size: 16px;">🌐</td>
                    <td style="padding-bottom: 12px; font-size: 14px; line-height: 1.5; color: #334155;">
                      <strong>LinkedIn & Social Media:</strong> Tag your team and professors with the hashtag <strong>#PiBiOpenIntelligence</strong>.
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Ready-to-copy WhatsApp Share Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <div style="font-size: 12px; font-weight: 700; color: #166534; text-transform: uppercase; margin-bottom: 8px;">
                      📲 Quick Share Template for WhatsApp
                    </div>
                    <div style="font-size: 13px; color: #14532d; line-height: 1.6; background-color: #ffffff; padding: 12px; border-radius: 8px; border: 1px dashed #86efac; margin-bottom: 12px;">
                      &ldquo;Hey everyone! 👋 Our project <strong>${safeProjectTitle}</strong> is participating in the PiBi Open Intelligence Student Project Awards 2026! 🚀 Please take a few seconds to support us and vote here: <a href="${safeVoteUrl}" style="color: #15803d; text-decoration: underline;">${safeVoteUrl}</a> &mdash; Every vote counts! Thank you! 🙏&rdquo;
                    </div>
                    <div style="text-align: center;">
                      <a href="${whatsappShareUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #25d366; color: #ffffff; font-size: 13px; font-weight: 700; padding: 8px 18px; border-radius: 20px; text-decoration: none;">
                        💬 Share on WhatsApp
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Grand Finale Reminder -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <div style="font-size: 13px; font-weight: 700; color: #854d0e; margin-bottom: 4px;">
                      🏆 What Happens Next?
                    </div>
                    <div style="font-size: 13px; color: #713f12; line-height: 1.6;">
                      &bull; <strong>Voting Closes:</strong> November 29<br>
                      &bull; <strong>Top 10 Finalist Announcement:</strong> November 30<br>
                      &bull; <strong>Grand Finale & Live Demos:</strong> December 12 (₹30,000 in Top 3 Cash Prizes + Incubation Support!)
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Sign-off -->
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #334155;">
                Wishing you the very best of luck,
              </p>
              <p style="margin: 0 0 2px 0; font-size: 15px; font-weight: 700; color: #0f172a;">
                PiBi Open Intelligence Team
              </p>
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                <a href="${safeShowcaseUrl}" style="color: #1f6fb2; text-decoration: none;">www.pibiopenintelligence.com</a> &bull; In partnership with Pi Bi Technologies & Madurai AI Community
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b;">
                You are receiving this email because your project was submitted to the PiBi Open Intelligence Student Project Awards 2026.
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; 2026 PiBi Open Intelligence. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

export function generateVotingEmailPlainText({
  studentName,
  projectTitle,
  institution,
  registrationId,
  voteUrl,
  showcaseUrl,
}) {
  return `Hi ${studentName || 'Student Innovator'},

🎉 Public Voting is Officially Live!
PiBi Open Intelligence – Student Project Awards 2026

Great news! Public voting has officially started on PiBi Open Intelligence. Your project is now featured live on our showcase hub, and it’s time to gather maximum community support!

Featured Project Details:
- Project: ${projectTitle}
- Institution: ${institution}
- Registration ID: ${registrationId}

👉 Cast Your Vote & View Your Project:
${voteUrl}

🚀 Share with Friends, Family & Peers to Win!
Every single vote increases your project's popularity score! The more people vote for your innovation, the stronger your chance of making it to the Top 10 Finalists.

How to get more votes:
1. Share with Friends & Family: Forward your voting link to family groups, friends, and college peers.
2. WhatsApp Groups & Status: Post your project demo link on your class groups, clubs, and WhatsApp status.
3. LinkedIn & Social Media: Tag your team and professors with the hashtag #PiBiOpenIntelligence.

Quick Share Message for WhatsApp:
"Hey everyone! 👋 Our project '${projectTitle}' is participating in the PiBi Open Intelligence Student Project Awards 2026! 🚀 Please take a few seconds to support us and vote here: ${voteUrl} — Every vote counts! Thank you! 🙏"

🏆 Important Timeline:
- Voting Closes: November 29
- Top 10 Finalist Announcement: November 30
- Grand Finale & Live Demos: December 12 (₹30,000 in Top 3 Cash Prizes + Incubation Support!)

Wishing you the very best of luck,
PiBi Open Intelligence Team
${showcaseUrl}
In partnership with Pi Bi Technologies & Madurai AI Community`;
}

export async function sendVotingAnnouncementEmail({
  toEmail,
  studentName,
  projectTitle,
  institution,
  registrationId,
  projectId,
}) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;

  if (!toEmail) {
    return { success: false, error: 'Recipient email is required' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pibiopenintelligence.com';

  // Construct voting URL
  let voteUrl = `${baseUrl}/top-projects`;
  if (projectId) {
    try {
      const token = makeProjectVoteToken(projectId);
      voteUrl = `${baseUrl}/vote/${token}`;
    } catch (e) {
      voteUrl = `${baseUrl}/registered-students?regId=${encodeURIComponent(registrationId || '')}`;
    }
  }

  const showcaseUrl = `${baseUrl}/registered-students`;

  const html = generateVotingEmailHtml({
    studentName,
    projectTitle,
    institution,
    registrationId,
    voteUrl,
    showcaseUrl,
  });

  const text = generateVotingEmailPlainText({
    studentName,
    projectTitle,
    institution,
    registrationId,
    voteUrl,
    showcaseUrl,
  });

  if (!SMTP_USER || !SMTP_PASS) {
    return { success: false, error: 'SMTP credentials missing' };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST || 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const fromEmail = process.env.SMTP_FROM_EMAIL || 'openintelligencepibi@gmail.com';

  const mailOptions = {
    from: `"PiBi Open Intelligence" <${fromEmail}>`,
    replyTo: fromEmail,
    to: toEmail,
    subject: `🎉 Public Voting is Officially Live! Vote & Share Your Project — PiBi Open Intelligence`,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId, voteUrl };
}
