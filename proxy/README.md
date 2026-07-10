# werken-met-ai-proxy

Cloudflare Worker die als beveiligde tussenlaag dient tussen de e-learning
"Werken met AI" en de Anthropic API. De browser van de deelnemer bevat geen
Anthropic-sleutel meer; die leeft alleen als secret op deze Worker.

Los, apart onderdeel naast de hoofdcursus (`src/` in de projectroot). Wijzigt
niets aan de bestaande cursus-code.

## Endpoint

```
POST https://werken-met-ai-proxy.timonmariuskool.workers.dev/chat
```

Kan desgewenst nog op een custom domein gezet worden via de
Cloudflare-dashboard (routes).

## Request-body

```json
{
  "toegangscode": "de-gekozen-toegangscode",
  "bericht": "De tekst die als user-message naar Claude gaat.",
  "systeeminstructie": "De volledige systeeminstructie (basisrol + beoordelingsinstructie), door de cursus zelf samengesteld.",
  "max_tokens": 800
}
```

| Veld | Verplicht | Toelichting |
|---|---|---|
| `toegangscode` | ja | Wordt vergeleken met de `TOEGANGSCODE`-secret. Bij een mismatch: `401`. |
| `bericht` | ja | Losse tekststring, wordt door de Worker als enkele `user`-message naar Anthropic gestuurd. Leeg/whitespace geeft `400`. |
| `systeeminstructie` | nee | Gaat 1-op-1 door naar het `system`-veld van het Anthropic-verzoek (bovenaan het verzoek, niet in `messages`). De cursus blijft zelf verantwoordelijk voor het samenstellen hiervan (basisrol + `beoordelingsinstructie` uit `cursus.json`), precies zoals `useAnthropicApi.js` dat nu al doet. |
| `max_tokens` | nee | Standaard `800`. Harde bovengrens op de Worker: `8000`. |
| `model` | nee | Standaard `claude-sonnet-4-6`. Alleen modellen in de whitelist in `src/index.js` (`TOEGESTANE_MODELLEN`) worden geaccepteerd; een onbekende waarde wordt genegeerd en vervangen door het standaardmodel. |

De `model`-parameter hoeft in de praktijk nu nergens expliciet meegegeven te
worden: zowel de feedback-aanroepen als de flyer-aanroep gebruiken hetzelfde
model, alleen `max_tokens` verschilt.

## Response

Bij succes (`200`): de ruwe JSON-response van Anthropic, ongewijzigd
doorgegeven. Het antwoord van Claude staat op `data.content[0].text`, precies
zoals `useAnthropicApi.js` dat nu al uitleest.

Bij een fout geeft de Worker de statuscode en foutinhoud door zoals
hieronder. De cursus kan de bestaande statuscode-mapping uit CLAUDE.md §6
grotendeels aanhouden:

| Status | Betekenis | Voorbeeldbody |
|---|---|---|
| `400` | Ongeldige aanvraag (geen JSON, leeg bericht) | `{ "fout": "Bericht ontbreekt of is leeg." }` |
| `401` | Toegangscode ontbreekt of klopt niet | `{ "fout": "Toegangscode klopt niet." }` |
| `429` | Daglimiet van 60 aanroepen per toegangscode bereikt | `{ "fout": "Dagelijkse limiet bereikt, probeer morgen opnieuw." }` |
| `429` (van Anthropic zelf) | Anthropic's eigen rate limit | ruwe Anthropic-foutbody |
| `401`/`403`/... (van Anthropic zelf) | bijvoorbeeld ongeldige `ANTHROPIC_API_KEY`-secret | ruwe Anthropic-foutbody |
| `502` | Netwerkfout tussen Worker en Anthropic | `{ "fout": "Geen verbinding met Anthropic. Probeer opnieuw." }` |
| `405`/`404` | Verkeerde methode of pad | `{ "fout": "..." }` |

## Voorbeeldaanroepen

### Gewone feedback-aanroep (800 tokens)

```json
{
  "toegangscode": "sk-cursus-2026",
  "bericht": "Mijn antwoord op de opdracht: ...",
  "systeeminstructie": "Je bent een behulpzame en warme leercoach voor een e-learning over AI-gebruik in de sociale sector. Je spreekt de leerling aan met 'je'. Je reageert altijd in het Nederlands. Houd je aan de beoordelingsinstructie.\n\n<beoordelingsinstructie uit cursus.json>",
  "max_tokens": 800
}
```

### Flyer-aanroep uit module 1, les 1 (4000 tokens)

```json
{
  "toegangscode": "sk-cursus-2026",
  "bericht": "<het bewerkbare promptveld van de deelnemer>",
  "systeeminstructie": "Je bent een behulpzame en warme leercoach ... \n\n<flyer_systeeminstructie uit cursus.json>",
  "max_tokens": 4000
}
```

## CORS

Alleen de volgende origins mogen de proxy aanroepen (zie `TOEGESTANE_ORIGINS`
in `src/index.js`):

- `https://timonkool.nl`
- `https://timonkool.github.io`
- `http://localhost:5173` (lokale dev-server van de cursus)
- `null` (voor het lokale `test.html`-bestand, dat via `file://` een
  `Origin: null` header meestuurt)

Andere origins krijgen geen `Access-Control-Allow-Origin`-header terug en
worden dus door de browser geblokkeerd.

## Daglimiet

Bijgehouden per toegangscode in de KV-namespace `RATE_LIMIT_KV`, sleutel
`daglimiet:<toegangscode>:<YYYY-MM-DD>` (UTC-datum), maximaal 60 aanroepen
per dag. De sleutel krijgt een TTL van 2 dagen mee zodat oude tellingen
vanzelf verdwijnen. Dit is geen atomaire teller (Workers KV ondersteunt geen
atomic increment zonder Durable Objects); bij losse, menselijke gebruikers is
dat in de praktijk geen probleem.

## Volgende stap (nieuwe sessie)

`src/hooks/useAnthropicApi.js` in de hoofdcursus ombouwen zodat `stuurVerzoek`
niet meer rechtstreeks naar `https://api.anthropic.com/v1/messages` gaat,
maar naar deze proxy. De functiesignatuur
(`stuurVerzoek(bericht, beoordelingsinstructie, maxTokens)`) kan ongewijzigd
blijven; alleen de `fetch`-aanroep, headers en URL veranderen. De
`SYSTEM_BASE`-logica (basisrol + beoordelingsinstructie samenvoegen) blijft
in de cursus-code staan, de proxy verwacht de kant-en-klare
`systeeminstructie`. De toegangscode moet dan ergens in de cursus ingevoerd
worden (nieuw scherm of instelling, buiten scope van deze sessie) in plaats
van de huidige Anthropic-sleutel.

## Lokaal ontwikkelen en deployen

```bash
cd proxy
npm install
npx wrangler dev              # lokaal testen
npx wrangler deploy           # naar Cloudflare deployen
npx wrangler secret put TOEGANGSCODE
npx wrangler secret put ANTHROPIC_API_KEY
```

Voor deploy en secrets is een geldig `CLOUDFLARE_API_TOKEN` nodig, gezet als
omgevingsvariabele in de terminal waarin je deze commando's draait.
