import { useState } from 'react'

const MODEL = "claude-haiku-4-5"
const MAX_TOKENS = 600
const TEMPERATURE = 0.4
const ENDPOINT = "https://api.anthropic.com/v1/messages"

const SYSTEM_BASE = `Je bent een behulpzame en warme leercoach voor een e-learning over AI-gebruik \
in de sociale sector. Je spreekt de leerling aan met 'je'. Je reageert altijd \
in het Nederlands. Houd je aan de beoordelingsinstructie.`

function getDatumKey() {
  return `api_calls_${new Date().toISOString().slice(0, 10)}`
}

function getAantalVandaag() {
  return parseInt(localStorage.getItem(getDatumKey()) || '0', 10)
}

function incrementAantalVandaag() {
  const key = getDatumKey()
  const huidig = getAantalVandaag()
  localStorage.setItem(key, String(huidig + 1))
}

const DAGELIJKS_LIMIET = 20

// Budgetlimiet is per browser/apparaat, niet absoluut.
// Voldoende voor kleine schaal gebruik.

export function useAnthropicApi() {
  const [laden, setLaden] = useState(false)
  const [fout, setFout] = useState(null)

  async function stuurVerzoek(gebruikersBericht, beoordelingsinstructie = '') {
    setFout(null)

    const apiSleutel = localStorage.getItem('anthropic_api_key')
    if (!apiSleutel) {
      setFout('Geen API-sleutel gevonden. Voer eerst je sleutel in via de instellingen.')
      return null
    }

    if (getAantalVandaag() >= DAGELIJKS_LIMIET) {
      setFout('Je hebt het dagelijkse aantal van 20 vragen bereikt. Morgen kun je weer verder.')
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
          max_tokens: MAX_TOKENS,
          temperature: TEMPERATURE,
          system: systeemInstructie,
          messages: [{ role: 'user', content: gebruikersBericht }],
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          setFout('Je API-sleutel klopt niet. Controleer of je hem goed hebt geplakt via de knop Sleutel wijzigen.')
        } else if (response.status === 429) {
          setFout('Je hebt het limiet bereikt. Wacht even en probeer opnieuw.')
        } else {
          setFout('Er ging iets mis. Probeer het opnieuw of ververs de pagina.')
        }
        return null
      }

      const data = await response.json()
      incrementAantalVandaag()
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
