import { useState } from 'react'

const MODEL = "claude-sonnet-4-6"
const MAX_TOKENS = 800
const TEMPERATURE = 0.4
const ENDPOINT = "https://api.anthropic.com/v1/messages"

const SYSTEM_BASE = `Je bent een behulpzame en warme leercoach voor een e-learning over AI-gebruik \
in de sociale sector. Je spreekt de leerling aan met 'je'. Je reageert altijd \
in het Nederlands. Houd je aan de beoordelingsinstructie.`

// Teller en kostenwaarschuwing zijn per browser/apparaat, niet absoluut.
// Er is geen daglimiet: de teller loopt door en blokkeert nooit.
// Bij 50 aanroepen verschijnt eenmalig een geruststellende kostenmelding.
const TOTAAL_KEY = 'api_aanroepen_totaal'
const WAARSCHUWING_GETOOND_KEY = 'kostenwaarschuwing_getoond'
const WAARSCHUWING_GRENS = 50
const KOSTEN_WAARSCHUWING_TEKST =
  'Je hebt inmiddels 50 vragen aan AI gesteld in deze cursus. Tot nu toe heb je ' +
  'naar schatting 0,08 euro aan API-krediet gebruikt. Dat valt ruimschoots binnen ' +
  'het startkrediet van je account. Je kunt gewoon doorgaan.'

function getTotaalAanroepen() {
  return parseInt(localStorage.getItem(TOTAAL_KEY) || '0', 10)
}

function incrementTotaalAanroepen() {
  const nieuw = getTotaalAanroepen() + 1
  localStorage.setItem(TOTAAL_KEY, String(nieuw))
  return nieuw
}

export function useAnthropicApi() {
  const [laden, setLaden] = useState(false)
  const [fout, setFout] = useState(null)
  const [kostenWaarschuwing, setKostenWaarschuwing] = useState(null)

  async function stuurVerzoek(gebruikersBericht, beoordelingsinstructie = '', maxTokens = MAX_TOKENS) {
    setFout(null)

    const apiSleutel = localStorage.getItem('anthropic_api_key')
    if (!apiSleutel) {
      setFout('Geen API-sleutel gevonden. Voer eerst je sleutel in via de instellingen.')
      return null
    }

    const systeemInstructie = beoordelingsinstructie
      ? `${SYSTEM_BASE}\n\n${beoordelingsinstructie}`
      : SYSTEM_BASE

    setLaden(true)
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiSleutel,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: maxTokens,
          temperature: TEMPERATURE,
          system: systeemInstructie,
          messages: [{ role: 'user', content: gebruikersBericht }],
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Ongeldige sleutel wissen zodat de gebruiker schoon opnieuw koppelt
          localStorage.removeItem('anthropic_api_key')
          setFout('Je API-sleutel klopt niet. Controleer of je hem goed hebt geplakt via de knop Sleutel wijzigen.')
        } else if (response.status === 429) {
          setFout('Je hebt het limiet bereikt. Wacht even en probeer opnieuw.')
        } else {
          setFout('Er ging iets mis. Probeer het opnieuw of ververs de pagina.')
        }
        return null
      }

      const data = await response.json()

      // Teller bijwerken en eenmalig de kostenmelding tonen bij 50 aanroepen
      const totaal = incrementTotaalAanroepen()
      if (totaal >= WAARSCHUWING_GRENS && localStorage.getItem(WAARSCHUWING_GETOOND_KEY) !== 'true') {
        localStorage.setItem(WAARSCHUWING_GETOOND_KEY, 'true')
        setKostenWaarschuwing(KOSTEN_WAARSCHUWING_TEKST)
      }

      return data.content?.[0]?.text ?? null
    } catch {
      setFout('Geen verbinding. Controleer je internet en probeer opnieuw.')
      return null
    } finally {
      setLaden(false)
    }
  }

  return { stuurVerzoek, laden, fout, setFout, kostenWaarschuwing, setKostenWaarschuwing }
}
