import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { hasProjectVoteLinkSecret, makeProjectVoteToken, votingWindowOpen } from '@/lib/project-vote-links';
import { verifyWhatsAppAdminSession, whatsappAdminCookie } from '@/lib/whatsapp-admin-session';

export const maxDuration = 120;

function normalizePhone(phone) {
  const input = String(phone || '').trim();
  if (!/^\+?[\d\s().-]+$/.test(input)) return null;
  const digits = input.replace(/\D/g, '');
  if (!input.startsWith('+') && /^[6-9]\d{9}$/.test(digits)) return `91${digits}`;
  return /^[1-9]\d{10,14}$/.test(digits) ? digits : null;
}

async function sendProject(project, config) {
  const phone = normalizePhone(project.phone);
  if (!phone) return 'invalidPhone';

  const key = `showcase_2026_whatsapp:${project.id}`;
  const { error } = await supabaseAdmin.from('app_settings').insert({ key, value: 'pending' });
  if (error) return error.code === '23505' ? 'alreadyClaimed' : 'failed';

  try {
    const response = await fetch(`https://graph.facebook.com/${config.version}/${config.phoneId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.accessToken}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: config.template,
          language: { code: config.language },
          components: [{
            type: 'body',
            parameters: [
              { type: 'text', text: project.lead_student || 'Participant' },
              { type: 'text', text: project.title },
              { type: 'text', text: new URL(`/vote/${makeProjectVoteToken(project.id)}`, config.siteUrl).href },
            ],
          }],
        },
      }),
    });

    if (response.ok) {
      await supabaseAdmin.from('app_settings').update({ value: 'accepted' }).eq('key', key);
      return 'accepted';
    }
    if (response.status >= 400 && response.status < 500 && response.status !== 408) {
      const { error: releaseError } = await supabaseAdmin.from('app_settings').delete().eq('key', key);
      return releaseError ? 'uncertain' : 'failed';
    }
    return 'uncertain';
  } catch {
    return 'uncertain';
  }
}

export async function POST(request) {
  try {
    if (request.headers.get('x-whatsapp-campaign') !== 'send') {
      return NextResponse.json({ error: 'Invalid campaign request.' }, { status: 403 });
    }
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session')?.value;
    if (!verifyWhatsAppAdminSession(session, cookieStore.get(whatsappAdminCookie)?.value)) {
      return NextResponse.json({ error: 'Sign in with a database-backed admin account to send the campaign.' }, { status: 403 });
    }

    const config = {
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
      phoneId: process.env.WHATSAPP_PHONE_NUMBER_ID,
      version: process.env.WHATSAPP_GRAPH_VERSION || 'v23.0',
      template: process.env.WHATSAPP_VOTING_TEMPLATE || 'showcase_voting_2026',
      language: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en',
      siteUrl: process.env.PROJECT_VOTE_PUBLIC_URL || 'https://www.pibiopenintelligence.com',
    };
    if (!config.accessToken || !/^\d+$/.test(config.phoneId || '') || !/^v\d+\.\d+$/.test(config.version || '') ||
        !config.siteUrl.startsWith('https://') || !hasProjectVoteLinkSecret()) {
      return NextResponse.json({ error: 'Configure WhatsApp and voting link settings in the server environment first.' }, { status: 503 });
    }
    new URL(config.siteUrl);

    if (!votingWindowOpen()) {
      return NextResponse.json({ error: 'The campaign can be sent during the 11–30 November voting window (IST).' }, { status: 409 });
    }

    const projects = [];
    const pageSize = 500;
    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await supabaseAdmin.from('student_project_submissions')
        .select('id, title, lead_student, phone')
        .order('id').range(offset, offset + pageSize - 1);
      if (error) throw error;
      projects.push(...data);
      if (data.length < pageSize) break;
    }

    const counts = { accepted: 0, failed: 0, alreadyClaimed: 0, invalidPhone: 0, uncertain: 0 };
    for (let index = 0; index < projects.length; index += 8) {
      const results = await Promise.all(projects.slice(index, index + 8).map(project => sendProject(project, config)));
      for (const result of results) counts[result] += 1;
    }
    return NextResponse.json(counts);
  } catch {
    return NextResponse.json({ error: 'Could not complete the WhatsApp campaign.' }, { status: 500 });
  }
}
