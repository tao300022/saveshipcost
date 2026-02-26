import { createClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL  as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // Visible in browser console — helps diagnose missing Vercel env vars
  console.error(
    '[Supabase] ❌ Missing env vars.\n' +
    '  VITE_SUPABASE_URL:', url      ? '✓' : '✗ NOT SET', '\n' +
    '  VITE_SUPABASE_ANON_KEY:', anonKey ? '✓' : '✗ NOT SET', '\n' +
    'Set these in Vercel → Project Settings → Environment Variables.',
  );
}

export const supabase = createClient(url ?? '', anonKey ?? '');

/*
 * ── Supabase Dashboard 必配项 ──────────────────────────────────────────────
 *
 * 1. Authentication → URL Configuration
 *    Site URL:
 *      https://www.saveshipcost.com
 *
 *    Redirect URLs（Add all）:
 *      https://www.saveshipcost.com/reset-password
 *      https://saveshipcost.com/reset-password
 *      http://localhost:5173/reset-password   ← 本地开发用
 *
 * 2. Vercel → Project Settings → Environment Variables（Production）:
 *    VITE_SUPABASE_URL      = https://<your-project-ref>.supabase.co
 *    VITE_SUPABASE_ANON_KEY = eyJ...（anon public key）
 *
 * 3. Authentication → Email Templates → Reset Password
 *    确认模板里的链接使用 {{ .ConfirmationURL }}（默认已正确）
 *
 * ─────────────────────────────────────────────────────────────────────────
 */
