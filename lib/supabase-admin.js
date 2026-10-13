import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const globalForSupabase = globalThis;

function getEnvValue(key) {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(new RegExp(`^${key}=\\s*([^\\r\\n]+)`, 'm'));
      if (match) return match[1].trim();
    }
  } catch {}
  return process.env[key];
}

export const supabaseAdmin = new Proxy({}, {
  get(target, prop) {
    const supabaseUrl = getEnvValue('NEXT_PUBLIC_SUPABASE_URL') || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseServiceKey = getEnvValue('SUPABASE_SERVICE_ROLE_KEY') || process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

    if (
      !globalForSupabase.supabaseAdmin ||
      globalForSupabase._lastSupabaseKey !== supabaseServiceKey ||
      globalForSupabase._lastSupabaseUrl !== supabaseUrl
    ) {
      if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey === 'placeholder-key') {
        const msg = `
============================================================
🚨 CRITICAL ERROR: MISSING SUPABASE ENVIRONMENT VARIABLES 🚨
============================================================
You are missing the 'SUPABASE_SERVICE_ROLE_KEY' in your .env file!
============================================================
`;
        console.error(msg);
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in .env file');
      }

      globalForSupabase._lastSupabaseKey = supabaseServiceKey;
      globalForSupabase._lastSupabaseUrl = supabaseUrl;
      globalForSupabase.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }

    return globalForSupabase.supabaseAdmin[prop];
  }
});
