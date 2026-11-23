import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';
import { createHash, timingSafeEqual } from 'node:crypto';
import { signWhatsAppAdminSession, whatsappAdminCookie, whatsappAdminSessionSeconds } from '@/lib/whatsapp-admin-session';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const loginEmail = email.trim().toLowerCase();
    const usingDefaultCredentials = loginEmail === 'admin@gmail.com' && password === 'root123';
    const hostname = new URL(request.url).hostname;
    const usingLocalAdmin = process.env.NODE_ENV === 'development' && usingDefaultCredentials &&
      ['localhost', '127.0.0.1', '[::1]'].includes(hostname);
    if (usingDefaultCredentials && !usingLocalAdmin) {
      return NextResponse.json({ error: 'The default admin password has been retired. Use your configured admin password.' }, { status: 401 });
    }

    const configuredPassword = process.env.ADMIN_PASSWORD;
    const configuredEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();
    const digest = value => createHash('sha256').update(value).digest();
    const usingConfiguredAdmin = loginEmail === configuredEmail && configuredPassword?.length >= 16 &&
      timingSafeEqual(digest(password), digest(configuredPassword));

    let admin = { id: 'admin-configured', email: loginEmail, name: 'Admin' };
    if (!usingConfiguredAdmin && !usingLocalAdmin) {
      const { data } = await supabaseAdmin.from('admins').select('*').eq('email', loginEmail).single();
      if (!data || !(await bcrypt.compare(password, data.password_hash))) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      admin = data;
    }

    // 3. Set a secure httpOnly admin session cookie — completely separate from Supabase
    const cookieStore = await cookies();
    const session = JSON.stringify({ id: admin.id, email: admin.email, name: admin.name, role: 'ADMIN' });
    const campaignSession = signWhatsAppAdminSession(session);
    if (!campaignSession) {
      return NextResponse.json({ error: 'Admin session signing is unavailable.' }, { status: 503 });
    }
    cookieStore.set(
      'admin_session',
      session,
      {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge:   60 * 60 * 8, // 8 hours
        path:     '/',
      }
    );
    cookieStore.set(whatsappAdminCookie, campaignSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: whatsappAdminSessionSeconds,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/admin/login]', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
