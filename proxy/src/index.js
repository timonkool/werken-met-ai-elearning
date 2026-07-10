// Cloudflare Worker: beveiligde tussenlaag tussen de e-learning "Werken met AI"
// en de Anthropic API. De browser van de deelnemer praat nooit rechtstreeks met
// Anthropic en bevat nooit een Anthropic-sleutel; die leeft alleen als secret
// op deze Worker (env.ANTHROPIC_API_KEY).
//
// Endpoint: POST /chat
// Zie proxy/README.md voor de exacte vorm van de request-body.

const ANTHROPIC_ENDPOINT = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'

const DEFAULT_MODEL = 'claude-sonnet-4-6'
const TOEGESTANE_MODELLEN = ['claude-sonnet-4-6']

const DEFAULT_MAX_TOKENS = 800
const MAX_TOKENS_LIMIET = 8000 // harde bovengrens, ongeacht wat de client vraagt

const DEFAULT_TEMPERATURE = 0.4

const DAGLIMIET_PER_CODE = 60
const KV_TTL_SECONDEN = 60 * 60 * 24 * 2 // 2 dagen, ruim genoeg om de daglimiet-sleutel te laten verlopen

// Domeinen die deze proxy mogen aanroepen. Voeg hier eventuele extra
// preview-/dev-domeinen toe. 'null' hoort bij het lokale test.html-bestand
// (file://), dat door de browser met Origin: null wordt verstuurd.
const TOEGESTANE_ORIGINS = [
  'https://timonkool.nl',
  'https://timonkool.github.io',
  'http://localhost:5173',
  'null',
]

function corsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
  if (origin && TOEGESTANE_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }
  return headers
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  })
}

// Constant-time vergelijking zodat de lengte/inhoud van de toegangscode niet
// via timing valt af te leiden.
function veiligGelijk(a, b) {
  const encoder = new TextEncoder()
  const bufA = encoder.encode(a)
  const bufB = encoder.encode(b)
  if (bufA.length !== bufB.length) return false
  let verschil = 0
  for (let i = 0; i < bufA.length; i++) {
    verschil |= bufA[i] ^ bufB[i]
  }
  return verschil === 0
}

function vandaag() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD (UTC)
}

async function controleerEnTelDaglimiet(env, toegangscode) {
  const sleutel = `daglimiet:${toegangscode}:${vandaag()}`
  const huidig = parseInt((await env.RATE_LIMIT_KV.get(sleutel)) || '0', 10)

  if (huidig >= DAGLIMIET_PER_CODE) {
    return { toegestaan: false }
  }

  // Let op: dit is geen atomaire increment (Workers KV kent die niet zonder
  // Durable Objects). Bij gelijktijdige verzoeken kan de teller een enkele
  // aanroep missen. Voor een eenvoudige daglimiet is dat acceptabel.
  await env.RATE_LIMIT_KV.put(sleutel, String(huidig + 1), {
    expirationTtl: KV_TTL_SECONDEN,
  })

  return { toegestaan: true, aantal: huidig + 1 }
}

async function handleChat(request, env) {
  const origin = request.headers.get('Origin')

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ fout: 'Ongeldige aanvraag: verwacht JSON.' }, 400, origin)
  }

  const toegangscode = typeof body.toegangscode === 'string' ? body.toegangscode : ''
  const bericht = typeof body.bericht === 'string' ? body.bericht : ''
  const systeeminstructie = typeof body.systeeminstructie === 'string' ? body.systeeminstructie : ''
  const model = TOEGESTANE_MODELLEN.includes(body.model) ? body.model : DEFAULT_MODEL

  let maxTokens = DEFAULT_MAX_TOKENS
  if (Number.isInteger(body.max_tokens) && body.max_tokens > 0) {
    maxTokens = Math.min(body.max_tokens, MAX_TOKENS_LIMIET)
  }

  if (!toegangscode) {
    return jsonResponse({ fout: 'Toegangscode ontbreekt.' }, 401, origin)
  }

  if (!veiligGelijk(toegangscode, env.TOEGANGSCODE)) {
    console.log(JSON.stringify({ event: 'auth_afgewezen' }))
    return jsonResponse({ fout: 'Toegangscode klopt niet.' }, 401, origin)
  }

  if (!bericht.trim()) {
    return jsonResponse({ fout: 'Bericht ontbreekt of is leeg.' }, 400, origin)
  }

  const limiet = await controleerEnTelDaglimiet(env, toegangscode)
  if (!limiet.toegestaan) {
    console.log(JSON.stringify({ event: 'daglimiet_bereikt' }))
    return jsonResponse({ fout: 'Dagelijkse limiet bereikt, probeer morgen opnieuw.' }, 429, origin)
  }

  let anthropicResponse
  try {
    anthropicResponse = await fetch(ANTHROPIC_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': ANTHROPIC_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature: DEFAULT_TEMPERATURE,
        system: systeeminstructie,
        messages: [{ role: 'user', content: bericht }],
      }),
    })
  } catch {
    console.log(JSON.stringify({ event: 'anthropic_netwerkfout' }))
    return jsonResponse({ fout: 'Geen verbinding met Anthropic. Probeer opnieuw.' }, 502, origin)
  }

  const data = await anthropicResponse.json().catch(() => null)

  console.log(
    JSON.stringify({
      event: 'anthropic_aanroep',
      status: anthropicResponse.status,
      aanroepen_vandaag: limiet.aantal,
    }),
  )

  if (!anthropicResponse.ok) {
    return jsonResponse(
      data ?? { fout: 'Er ging iets mis bij Anthropic.' },
      anthropicResponse.status,
      origin,
    )
  }

  return jsonResponse(data, 200, origin)
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin')
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (url.pathname !== '/chat') {
      return jsonResponse({ fout: 'Onbekend endpoint.' }, 404, origin)
    }

    if (request.method !== 'POST') {
      return jsonResponse({ fout: 'Alleen POST wordt ondersteund.' }, 405, origin)
    }

    return handleChat(request, env)
  },
}
