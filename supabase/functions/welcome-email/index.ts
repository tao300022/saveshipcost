import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL = 'noreply@send.saveshipcost.com';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  console.log('[welcome-email] invoked, method:', req.method);
  try {
    const payload = await req.json();
    console.log('[welcome-email] payload keys:', Object.keys(payload || {}));

    const user = payload?.record ?? payload?.user;
    const email = user?.email;
    console.log('[welcome-email] email:', email ?? 'NOT FOUND');

    if (!email) {
      return new Response(JSON.stringify({ error: 'No email found' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: 'SaveShipCost 欢迎您 · 专属优惠等你领取',
        html: `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px;color:#333;">
  <h2 style="color:#0d1b4b;margin-bottom:8px;">欢迎加入 SaveShipCost 🎉</h2>
  <p style="color:#666;margin-bottom:24px;">
    感谢您注册，您现在可以直接登录使用我们的跨境运费比价服务。
  </p>
  <hr style="margin:24px 0;border:none;border-top:1px solid #eee;">
  <h3 style="color:#0d1b4b;margin-bottom:8px;">🎁 新用户专属优惠</h3>
  <p style="color:#555;line-height:1.7;">
    使用折扣码 <strong style="color:#667eea;">savecost</strong>，立享跨境运费优惠！
  </p>
  <a href="https://goingbus.com?s=pR2IcnIH"
     style="display:inline-block;margin-top:12px;padding:10px 24px;background:#f0f4ff;color:#667eea;text-decoration:none;border-radius:8px;font-weight:bold;border:1.5px solid #667eea;">
    👉 立即领取优惠
  </a>
  <p style="margin-top:8px;font-size:12px;color:#aaa;">链接：https://goingbus.com?s=pR2IcnIH</p>
  <hr style="margin:32px 0;border:none;border-top:1px solid #eee;">
  <p style="font-size:12px;color:#bbb;text-align:center;">
    SaveShipCost · 加拿大华人跨境运费比价平台 · saveshipcost.com
  </p>
</div>`,
      }),
    });

    const data = await res.json();
    console.log('[welcome-email] Resend status:', res.status, JSON.stringify(data).slice(0, 200));
    return new Response(JSON.stringify(data), {
      status: res.status, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[welcome-email] error:', String(err));
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});
