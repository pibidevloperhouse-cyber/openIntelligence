import { createHmac, timingSafeEqual } from 'node:crypto';

export const whatsappAdminCookie = 'whatsapp_admin_session';
export const whatsappAdminSessionSeconds = 8 * 60 * 60;

function signature(session, expires) {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || secret.length < 32) return null;
  return createHmac('sha256', secret).update(`whatsapp-admin:${expires}:${session}`).digest('base64url');
}

export function signWhatsAppAdminSession(session) {
  const expires = Date.now() + whatsappAdminSessionSeconds * 1000;
  const signed = signature(session, expires);
  return signed ? `${expires}.${signed}` : '';
}

export function verifyWhatsAppAdminSession(session, token) {
  if (!session || !/^\d{13}\.[A-Za-z0-9_-]{43}$/.test(token || '')) return false;
  const [expires, signed] = token.split('.');
  if (Number(expires) <= Date.now()) return false;
  const expected = signature(session, expires);
  return !!expected && timingSafeEqual(Buffer.from(signed), Buffer.from(expected));
}
