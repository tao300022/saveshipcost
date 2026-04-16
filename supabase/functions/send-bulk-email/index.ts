import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FROM_EMAIL = 'noreply@send.saveshipcost.com';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  try {
    const { subject, html } = await req.json();
    if (!subject || !html) {
      return new Response(JSON.stringify({ error: 'subject and html are required' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // 用 service role 列出所有注册用户
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: { users }, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
    if (listErr) {
      return new Response(JSON.stringify({ error: listErr.message }), {
        status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const emails = users.map((u) => u.email).filter(Boolean) as string[];
    if (emails.length === 0) {
      return new Response(JSON.stringify({ error: 'No users found', sent: 0, total: 0 }), {
        status: 200, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // Resend batch API：每次最多 100 封
    let sent = 0;
    for (let i = 0; i < emails.length; i += 100) {
      const batch = emails.slice(i, i + 100);
      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify(batch.map((to) => ({ from: FROM_EMAIL, to, subject, html }))),
      });
      if (res.ok) sent += batch.length;
    }

    return new Response(JSON.stringify({ success: true, sent, total: emails.length }), {
      status: 200, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});
