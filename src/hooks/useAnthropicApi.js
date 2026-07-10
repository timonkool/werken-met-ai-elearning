import { useState } from 'react'

// Alle AI-verkeer loopt via de eigen Cloudflare Worker-proxy (map proxy/ in
// deze repo). De browser van de deelnemer bevat geen Anthropic-sleutel; de
// deelnemer identificeert zich met een toegangscode die de cursusbeheerder
// uitdeelt. Model en temperature worden door de proxy bepaald
// (proxy/src/index.js), de cursus stuurt alleen bericht, systeeminstructie
// en max_tokens mee.
const ENDPOINT = 'https://werken-met-ai-proxy.timonmariuskool.workers.dev/chat'
const MAX_TOKENS = 800

export const TOEGANGSCODE_KEY = 'toegangscode'

const SYSTEM_BASE = `Je bent een behulpzame en warme leercoach voor een e-learning over AI-gebruik \
in de sociale sector. Je spreekt de leerling aan met 'je'. Je reageert altijd \
in het Nederlands. Houd je aan de beoordelingsinstructie.`

// Controleert een toegangscode bij de proxy zonder een echte AI-aanroep te
// doen (en dus zonder de daglimiet te belasten): een bewust leeg bericht
// levert 401 op bij een foute code en 400 bij een correcte code, nog vóór
// de proxy Anthropic aanroept.
// Retourneert 'geldig', 'ongeldig' of 'fout' (netwerk-/serverprobleem).
export async function controleerToegangscode(code) {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toegangscode: code, bericht: '' }),
    })
    if (response.status === 400) return 'geldig'
    if (response.status === 401) return 'ongeldig'
    return 'fout'
  } catch {
    return 'fout'
  }
}

export function useAnthropicApi() {
  const [laden, setLaden] = useState(false)
  const [fout, setFout] = useState(null)

  async function stuurVerzoek(gebruikersBericht, beoordelingsinstructie = '', maxTokens = MAX_TOKENS) {
    setFout(null)

    const toegangscode = localStorage.getItem(TOEGANGSCODE_KEY)
    if (!toegangscode) {
      setFout('Geen toegangscode gevonden. Vul eerst je toegangscode in via module 0.')
      return null
    }

    const systeemInstructie = beoordelingsinstructie
      ? `${SYSTEM_BASE}\n\n${beoordelingsinstructie}`
      : SYSTEM_BASE

    setLaden(true)
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toegangscode,
          bericht: gebruikersBericht,
          systeeminstructie: systeemInstructie,
          max_tokens: maxTokens,
        }),
      })

      if (!response.ok) {
        // Proxy-eigen fouten hebben een Nederlands `fout`-veld; fouten die
        // rechtstreeks van Anthropic komen (bv. een probleem met de sleutel
        // op de proxy) hebben dat niet en zijn nooit door de deelnemer op
        // te lossen.
        const foutData = await response.json().catch(() => null)
        const proxyFout = typeof foutData?.fout === 'string' ? foutData.fout : ''

        if (response.status === 401 && proxyFout.toLowerCase().includes('toegangscode')) {
          // Ongeldige code wissen zodat de deelnemer schoon opnieuw koppelt
          localStorage.removeItem(TOEGANGSCODE_KEY)
          setFout('Je toegangscode klopt niet. Vul hem opnieuw in via module 0.')
        } else if (response.status === 429 && proxyFout.toLowerCase().includes('dagelijkse')) {
          setFout('De cursus heeft vandaag zijn maximum aan AI-vragen bereikt. Probeer het morgen opnieuw; je voortgang blijft bewaard.')
        } else if (response.status === 429) {
          setFout('Je hebt het limiet bereikt. Wacht even en probeer opnieuw.')
        } else {
          setFout('Er ging iets mis. Probeer het opnieuw of ververs de pagina.')
        }
        return null
      }

      const data = await response.json()
      return data.content?.[0]?.text ?? null
    } catch {
      setFout('Geen verbinding. Controleer je internet en probeer opnieuw.')
      return null
    } finally {
      setLaden(false)
    }
  }

  return { stuurVerzoek, laden, fout, setFout }
}
