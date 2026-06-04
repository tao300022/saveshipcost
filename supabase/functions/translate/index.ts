// Supabase Edge Function: translate
// Translates a dict of {field: text} from source language to N target languages via DeepL.
//
// Request body:
//   { fields: Record<string,string>, source?: 'zh'|'en'|..., targets: ('en'|'fr'|'es'|'zh')[] }
//
// Response:
//   { en: Record<string,string>, fr: Record<string,string>, es: Record<string,string> }
//   (one entry per requested target; field order preserved)
//
// Env vars required:
//   DEEPL_API_KEY     — DeepL Auth Key (suffix ":fx" means free tier)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const DEEPL_API_KEY = Deno.env.get('DEEPL_API_KEY');

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const LANG_MAP: Record<string, string> = {
  zh: 'ZH',
  en: 'EN',
  fr: 'FR',
  es: 'ES',
};

// DeepL uses a different host for the free tier vs. the paid tier.
// Free-tier keys end in ":fx" — detect and route accordingly.
function deeplEndpoint(): string {
  const free = DEEPL_API_KEY?.endsWith(':fx');
  return free
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';
}

async function translateBatch(
  texts: string[],
  sourceLang: string,
  targetLang: string,
): Promise<string[]> {
  const params = new URLSearchParams();
  params.append('source_lang', sourceLang);
  params.append('target_lang', targetLang);
  for (const t of texts) params.append('text', t);

  const res = await fetch(deeplEndpoint(), {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepL ${res.status}: ${err}`);
  }
  const data = await res.json() as { translations: { text: string }[] };
  return data.translations.map((t) => t.text);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  if (!DEEPL_API_KEY) {
    return new Response(JSON.stringify({ error: 'DEEPL_API_KEY not configured' }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { fields, source = 'zh', targets } = await req.json() as {
      fields: Record<string, string>;
      source?: string;
      targets: string[];
    };

    if (!fields || typeof fields !== 'object') {
      return new Response(JSON.stringify({ error: 'fields must be a non-empty object' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }
    if (!Array.isArray(targets) || targets.length === 0) {
      return new Response(JSON.stringify({ error: 'targets must be a non-empty array' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const sourceLang = LANG_MAP[source];
    if (!sourceLang) {
      return new Response(JSON.stringify({ error: `unsupported source: ${source}` }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // Preserve field order so we can map results back by index.
    const fieldKeys = Object.keys(fields);
    const fieldValues = fieldKeys.map((k) => fields[k] ?? '');

    // Skip fields that are empty — DeepL bills per character even on empty strings.
    const nonEmptyIdx: number[] = [];
    const nonEmptyTexts: string[] = [];
    fieldValues.forEach((v, i) => {
      if (v && v.trim().length > 0) {
        nonEmptyIdx.push(i);
        nonEmptyTexts.push(v);
      }
    });

    const result: Record<string, Record<string, string>> = {};

    for (const target of targets) {
      const targetLang = LANG_MAP[target];
      if (!targetLang || target === source) continue;

      const translated = nonEmptyTexts.length > 0
        ? await translateBatch(nonEmptyTexts, sourceLang, targetLang)
        : [];

      const langResult: Record<string, string> = {};
      fieldKeys.forEach((k, i) => {
        const pos = nonEmptyIdx.indexOf(i);
        langResult[k] = pos >= 0 ? translated[pos] : fieldValues[i];
      });
      result[target] = langResult;
    }

    return new Response(JSON.stringify(result), {
      status: 200, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[translate] error:', e);
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});
