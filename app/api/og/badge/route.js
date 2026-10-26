import path from 'path';
import sharp from 'sharp';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

function splitIntoLines(text, maxChars = 24) {
  if (!text) return { line1: '', line2: '' };
  const str = String(text).trim();
  if (str.length <= maxChars) {
    return { line1: str, line2: '' };
  }
  const words = str.split(/\s+/);
  if (words.length <= 1) {
    return { line1: str.slice(0, maxChars), line2: str.slice(maxChars, maxChars * 2) };
  }
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(' '),
    line2: words.slice(mid).join(' '),
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('regId') || '';
    if (!id) {
      return new Response('Badge ID required', { status: 400 });
    }

    const memberParam = searchParams.get('member') || searchParams.get('name');
    const cleanId = decodeURIComponent(id).replace(/\.png$/i, '').trim();

    let query = supabaseAdmin
      .from('student_project_submissions')
      .select('registration_id, lead_student, title, institution, dept, year, domain, category, team_members')
      .neq('status', 'REJECTED');

    if (cleanId.toUpperCase().startsWith('PIBI-')) {
      query = query.ilike('registration_id', cleanId);
    } else if (cleanId.length === 24 || cleanId.length === 32) {
      query = query.eq('share_token', cleanId);
    } else if (cleanId.includes('-')) {
      query = query.eq('id', cleanId);
    } else {
      query = query.ilike('registration_id', `%${cleanId}%`);
    }

    const { data: record } = await query.maybeSingle();

    const studentName = (memberParam || record?.lead_student || 'Student Innovator').toUpperCase();
    const institution = record?.institution || 'Engineering College';
    const dept = record?.dept || '';
    const year = record?.year || '';
    const academicText = [year, dept].filter(Boolean).join(' • ') || '2026 Innovation Candidate';

    const nameLines = splitIntoLines(studentName, 22);
    const collegeLines = splitIntoLines(institution, 24);
    const academicLines = splitIntoLines(academicText, 32);

    const svg = `
      <svg width="1609" height="977" viewBox="0 0 1609 977" xmlns="http://www.w3.org/2000/svg">
        <style>
          .t-bold { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: bold; fill: #0e3869; dominant-baseline: middle; }
        </style>
        ${nameLines.line2 ? `
          <text x="245" y="710" font-size="18" class="t-bold">${escapeXml(nameLines.line1)}</text>
          <text x="245" y="734" font-size="18" class="t-bold">${escapeXml(nameLines.line2)}</text>
        ` : `
          <text x="245" y="722" font-size="${studentName.length > 18 ? 19 : 22}" class="t-bold">${escapeXml(nameLines.line1)}</text>
        `}
        ${collegeLines.line2 ? `
          <text x="710" y="710" font-size="17" class="t-bold">${escapeXml(collegeLines.line1)}</text>
          <text x="710" y="734" font-size="17" class="t-bold">${escapeXml(collegeLines.line2)}</text>
        ` : `
          <text x="710" y="722" font-size="19" class="t-bold">${escapeXml(collegeLines.line1)}</text>
        `}
        ${academicLines.line2 ? `
          <text x="1180" y="710" font-size="16" class="t-bold">${escapeXml(academicLines.line1)}</text>
          <text x="1180" y="734" font-size="16" class="t-bold">${escapeXml(academicLines.line2)}</text>
        ` : `
          <text x="1180" y="722" font-size="${academicText.length > 28 ? 16 : 18}" class="t-bold">${escapeXml(academicLines.line1)}</text>
        `}
      </svg>
    `;

    const bgPath = path.join(process.cwd(), 'public/images/pibi_badge_clean.png');
    const imageBuffer = await sharp(bgPath)
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .png({ quality: 90, compressionLevel: 8 })
      .toBuffer();

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': String(imageBuffer.length),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    console.error('[GET /api/og/badge]', err);
    return new Response('Error generating badge image', { status: 500 });
  }
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}
