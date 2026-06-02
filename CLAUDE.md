# CLAUDE.md — werken-met-ai-elearning

Dit document is de werkinstructie voor Claude Code bij het bouwen en onderhouden van de e-learning "Werken met AI". Lees dit document volledig voor je een taak uitvoert. Sla geen secties over.

---

## 1. Projectoverzicht

**Eigenaar:** Timon Kool
**Doel:** Een volledig werkende e-learning over AI-gebruik voor medewerkers en vrijwilligers van stichtingen in de sociale sector. Zes modules, opdrachten met AI-feedback, PDF-certificaat bij voltooiing.
**Tech stack:** React via Vite. Geen backend. Geen externe UI-libraries behalve react-markdown (voor het renderen van markdown in theorie-blokken) en jsPDF (voor het certificaat).
**Hosting:** GitHub Pages, verbonden aan timonkool.nl via de bestaande repository-setup.
**Branch:** Alles wordt direct naar `main` gepusht. Geen feature branches.
**Doelgroep van de e-learning:** Niet-technische volwassenen, vrijwilligers en medewerkers van stichtingen. Geen programmeerkennis, geen AI-voorkennis.

---

## 2. Mappenstructuur

Houd je strikt aan deze structuur. Maak geen nieuwe mappen aan zonder expliciete goedkeuring.

```
/
├── index.html                      # Vite entrypoint
├── CLAUDE.md                       # Dit document
├── vite.config.js                  # Vite configuratie
├── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages deployment
├── public/
│   └── fonts/                      # Eventuele lokale fonts
├── src/
│   ├── main.jsx                    # React startpunt
│   ├── App.jsx                     # Hoofdcomponent met routing en layout
│   ├── styles/
│   │   └── globals.css             # Globale stijlen en CSS-variabelen
│   ├── data/
│   │   └── cursus.json             # Alle cursusinhoud als JSON
│   ├── hooks/
│   │   ├── useAnthropicApi.js      # API-aanroep logica
│   │   └── useVoortgang.js         # Voortgang in localStorage
│   ├── components/
│   │   ├── Navigatie.jsx           # Zijbalk met moduleoverzicht
│   │   ├── ModuleWeergave.jsx      # Wrapper voor een actieve module
│   │   ├── LesBlok.jsx             # Herbruikbaar les-component
│   │   └── [overige componenten]
│   └── modules/
│       ├── module-0/               # Welkom en API-koppeling
│       ├── module-1/               # Wat is AI eigenlijk?
│       ├── module-2/               # Veilig gebruik
│       ├── module-3/               # Goede prompts schrijven
│       ├── module-4/               # Drie doorlopende oefeningen
│       └── module-5/               # Afsluiting en certificaat
```

### Naamgevingsconventie

- Alle bestandsnamen in **lowercase** met koppelteken: `mijn-component.jsx`
- Uitzondering: React-componenten gebruiken **PascalCase**: `LesBlok.jsx`, `Navigatie.jsx`
- Mappen altijd lowercase met koppelteken: `module-0/`, `werken-met-ai-elearning/`
- Geen spaties, underscores of gemengde conventies

---

## 3. Wat je zelfstandig mag doen

De volgende taken voer je uit zonder eerst te vragen:

- Spelfouten en interpunctiefouten corrigeren in tekst en code
- Kleine tekstaanpassingen die aansluiting verbeteren
- Bugfixes: kapotte links, ontbrekende sluit-tags, stijlen die breken op een specifieke schermgrootte
- Foutafhandeling toevoegen of verbeteren aan bestaande API-aanroepen
- CSS-aanpassingen die direct voortvloeien uit een gevraagde wijziging

## 4. Wat je altijd eerst moet voorleggen

Leg de volgende zaken altijd voor met een korte toelichting en wacht op goedkeuring:

- Nieuwe modules of lessen toevoegen
- De cursusstructuur in cursus.json fundamenteel wijzigen
- Nieuwe npm-packages installeren (buiten react-markdown en jsPDF)
- Wijzigingen in de API-aanroeplogica in useAnthropicApi.js
- Wijzigingen in de voortgangs- of certificaatlogica
- Alles wat de mappenstructuur of naamgevingsconventie doorbreekt
- Grote stijlaanpassingen die meerdere componenten raken

Bij twijfel: voorleggen, niet zelf beslissen.

---

## 5. Veiligheid en privacy

Dit zijn harde regels zonder uitzonderingen:

- **Nooit** een API-sleutel, wachtwoord of token in de code plaatsen, ook niet als placeholder of voorbeeld
- De Anthropic API-sleutel komt altijd van de gebruiker zelf via een invoerveld. Hij wordt opgeslagen in `localStorage` onder de key `"anthropic_api_key"` en nergens anders
- **Nooit** persoonsgegevens van cursusdeelnemers opslaan. De naam voor het certificaat wordt alleen lokaal verwerkt in de browser en niet verstuurd
- De beoordelingsinstructies in cursus.json (het veld `beoordelingsinstructie` per opdracht) zijn bedoeld voor de API en mogen **nooit** zichtbaar worden gerenderd voor de deelnemer. Ze worden alleen gebruikt als systeeminstructie in de API-aanroep.

---

## 6. De Anthropic API

### Vaste instellingen

Alle instellingen staan als constanten bovenaan `src/hooks/useAnthropicApi.js`:

```javascript
const MODEL = "claude-haiku-4-5";       // Pas hier aan bij modelwijziging
const MAX_TOKENS = 600;
const TEMPERATURE = 0.4;
const ENDPOINT = "https://api.anthropic.com/v1/messages";
```

### Verplichte headers

```javascript
"Content-Type": "application/json"
"x-api-key": [sleutel uit localStorage]
"anthropic-version": "2023-06-01"
"anthropic-dangerous-direct-browser-access": "true"
```

De vierde header is verplicht voor browser-aanroepen. Zonder hem blokkeert CORS elke aanroep.

### Foutafhandeling

Toon altijd een zichtbare foutmelding in de UI, nooit alleen in de console:

| Foutcode | Bericht voor de gebruiker |
|----------|--------------------------|
| 401 | "Je API-sleutel klopt niet. Controleer hem via de instellingen." |
| 429 | "Je hebt het limiet bereikt. Wacht even en probeer opnieuw." |
| Netwerkfout | "Geen verbinding. Controleer je internet en probeer opnieuw." |
| Overig | "Er ging iets mis. Probeer het opnieuw of ververs de pagina." |

Foutmeldingen verschijnen in een oranje blok in de UI. Nooit als browser `alert()`.

### Budgetbescherming

Houd in `localStorage` bij hoeveel API-aanroepen er vandaag zijn gedaan (key: `"api_calls_[datum]"`, formaat: `"2026-04-23"`). Na 20 aanroepen per dag: toon een vriendelijke melding dat het daglimiet bereikt is. Dit is een zachte limiet per browser per apparaat en geen absolute beveiliging. Voeg een comment toe in de code:

```javascript
// Budgetlimiet is per browser/apparaat, niet absoluut.
// Voldoende voor kleine schaal gebruik.
```

### Leegte-validatie

Controleer altijd via `trim()` of een tekstinvoerveld niet leeg is voordat een API-aanroep wordt gedaan. Bij lege invoer: toon een inline melding direct onder het veld ("Vul eerst je antwoord in."), geen API-aanroep.

---

## 7. Cursusstructuur in cursus.json

### Structuur per module

```json
{
  "id": "module-1",
  "titel": "Wat is AI eigenlijk?",
  "duur": 35,
  "kleur": "#1F4E79",
  "beschrijving": "...",
  "externe_tool_vereist": false,
  "voltooiing": false,
  "lessen": []
}
```

### Structuur per les

```json
{
  "id": "les-1-1",
  "titel": "...",
  "externe_tool_vereist": false,
  "theorie": { "tekst": "...", "video_url": null, "video_beschrijving": "..." },
  "kennischeck": {
    "vraag": "...",
    "opties": ["...", "...", "...", "..."],
    "correct": 1,
    "uitleg_correct": "..."
  },
  "opdracht": {
    "tekst": "...",
    "beoordelingsinstructie": "...",
    "voorbeeld_antwoord": "..."
  }
}
```

### Regels voor cursus.json

- ID-conventies zijn consistent: `module-0` t/m `module-5`, `les-X-Y`, `oef-X-Y-Z`
- Het veld `externe_tool_vereist` staat op elk les-object, ook als de waarde `false` is
- Het veld `beoordelingsinstructie` is altijd aanwezig bij opdrachten en bevat de instructie voor de AI-leercoach
- Het veld `voorbeeld_antwoord` wordt na AI-feedback getoond als inklapbaar blok ("Bekijk voorbeeldantwoord"). Het rendert nooit automatisch.
- Documentatie-velden staan in `meta._docs`, nooit als losse velden op hetzelfde niveau als `titel` of `taal`

---

## 8. Visuele stijl

De e-learning volgt de persoonlijke huisstijl uit `stijlgids_zacht_groen.md` (de "Saliegroene rust" stijl). Hieronder staan alle regels die Claude Code nodig heeft om consequent in die stijl te werken. De volledige stijlgids is de bron bij twijfel.

### Kernprincipes

1. **Rust boven flits.** Geen harde contrasten, geen drukke patronen.
2. **Saliegroen als anker.** Één dominante kleurfamilie, gedempt en warm.
3. **Subtiele rondingen.** Hoeken altijd licht afgerond, nooit scherp.
4. **Eén signature truc.** De kleurwissel-kop alleen voor titels die het zwaartepunt van een compositie vormen.

### Kleurpalet

Alle kleuren als CSS-variabelen in `globals.css`. Nooit hardcoded hex in componenten.

```css
/* Primaire kleuren */
--sage-deep:  #6b8068;   /* Hoofdkleur: vlakken, knoppen, accenten */
--sage-ink:   #3a4a38;   /* Koppen, donkere tekst */
--cream:      #faf8f4;   /* Warme witte hoofdachtergrond */

/* Secundaire kleuren */
--sage:       #8ba287;   /* Lichter accent, lijnen, decoratie */
--sage-soft:  #c8d4c4;   /* Zachte achtergronden, badges */
--sage-mist:  #eef2ec;   /* Card-achtergronden */
--paper:      #ffffff;   /* Puur wit, alleen waar cream te warm is */

/* Tekst */
--text:       #2d352c;   /* Body-tekst */
--muted:      #6b7268;   /* Secundaire tekst, captions */
```

**Regels:**
- Een groen vlak heeft altijd `--cream` of `--paper` als tekstkleur, nooit zwart of een ander groen
- Een cream vlak heeft `--sage-ink` of `--sage-deep` als koptekst, body in `--text` of `--muted`
- Geen andere kleuren toevoegen. Geen rood, blauw, geel, oranje
- Geen gradiënten

**Functionele uitzonderingen binnen de cursusinhoud:**
De cursusblokken (theorie, opdracht, feedback) gebruiken gekleurde randen om hun functie te markeren, maar altijd op een cream of sage-mist achtergrond:
- Theorie-blok: `--sage-deep` rand links, `--sage-mist` achtergrond
- Opdracht-blok: `--sage` rand links, `--cream` achtergrond
- Feedback-blok: `--sage-soft` rand links, `--sage-mist` achtergrond
- Voltooiing/succes: `--sage-ink` als accentkleur

### Typografie

**Lettertypes laden in index.html:**
```html
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Fraunces:ital,wght@1,300&display=swap" rel="stylesheet">
```

| Element | Lettertype | Grootte | Gewicht | Line-height |
|---------|-----------|---------|---------|-------------|
| Display kop (kleurwissel) | Quicksand | 48-72px | 700 | 1 |
| H1 | Quicksand | 32-40px | 600 | 1.1 |
| H2 | Quicksand | 22-26px | 600 | 1.2 |
| H3 | Quicksand | 15-18px | 600 | 1.3 |
| Body | Quicksand | 14-15px | 400 | 1.6-1.7 |
| Lead/citaat | Fraunces italic | 16-18px | 300 | 1.6 |
| Label/tag | Quicksand | 11px | 500 | 1 |

**Regels:**
- Labels en tags altijd in UPPERCASE met `letter-spacing: 2-3px`
- Display koppen: `letter-spacing: -0.5px` tot `-1px`
- Geen underlines onder koppen
- Mail-fallback: `'Trebuchet MS', Verdana, Arial, sans-serif`

### Vormgeving

```css
--radius-sm:   6px;    /* Kleine elementen, badges */
--radius-md:   10px;   /* Cards, inputs */
--radius-lg:   12px;   /* Containers, hoofdblokken */
--radius-pill: 999px;  /* Knoppen, capsules */
```

- Schaduw maximaal: `box-shadow: 0 4px 24px rgba(0,0,0,0.06)`
- Lead-tekst: `border-left: 3px solid var(--sage-deep); padding-left: 14px;` in Fraunces italic
- Geen harde drop-shadows, geen scherpe hoeken (`border-radius: 0`)
- Geen volledige randen om vlakken, alleen border-radius en achtergrondkleur als scheiding
- Alle blokken: `word-wrap: break-word; overflow-wrap: anywhere`

**Knoppen:**
- Pill-vorm (`border-radius: 999px`), minimaal 48px hoog
- Primaire knop: `--sage-deep` achtergrond, `--cream` tekst
- Secundaire knop: `--cream` achtergrond, `--sage-deep` tekst, `--sage` rand

**Textarea-velden:** minimaal 120px hoog op mobiel

### De signature kleurwissel-kop

Gebruik spaarzaam: alleen voor de hoofdtitel van de cursus en de modulekoppen.

De truc: twee identieke teksten over elkaar. Één wit (zichtbaar in het groene vlak), één groen (zichtbaar op cream). Een overlap van 5% creëert de zachte overgang.

```html
<div class="header">           <!-- groene band: background: var(--sage-deep) -->
  <span class="label">MODULE 1</span>
</div>
<div class="title-zone">       <!-- height = font-size, margin-top = -(2/3 × font-size) -->
  <h1 class="title title-white">Wat is AI eigenlijk?</h1>
  <h1 class="title title-green">Wat is AI eigenlijk?</h1>
</div>
```

```css
.title {
  position: absolute; top: 0; left: 0;
  font-size: 48px; font-weight: 700;
  line-height: 1;           /* VERPLICHT — breekt anders */
  letter-spacing: -0.5px;
  white-space: nowrap; margin: 0;
}
.title-white { color: var(--cream);     clip-path: inset(0 0 50% 0); }
.title-green { color: var(--sage-deep); clip-path: inset(45% 0 0 0); }
```

**Verhoudingen bij schalen:**

| Variabele | Verhouding |
|-----------|-----------|
| `font-size` | basis |
| `title-zone height` | gelijk aan font-size |
| `title-zone margin-top` | `-(2/3 × font-size)` |
| `header height` | `≈ 1.5 × font-size` |

**Veelgemaakte fouten:**
- `line-height: 1` weglaten op de kleurwissel-kop — dit breekt de clip altijd
- Clips exact op 50/50 zetten — dit geeft een harde scheiding, houd 5% overlap
- Witte achtergrond gebruiken achter de kop in plaats van `--cream`

### Mobiel

Layout desktop: navigatie links (260px), inhoud rechts.
Layout mobiel (< 768px): navigatie als overlay via hamburger-menu, inhoud op volledige breedte.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Verboden

- Andere kleuren dan de saliegroen-familie en cream-familie
- Felle accentkleuren (rood, blauw, geel, oranje)
- Gradiënten
- Drop-shadows zwaarder dan `0 4px 24px rgba(0,0,0,0.06)`
- Scherpe hoeken (`border-radius: 0`)
- Underlines onder koppen
- Meer dan twee lettertypes tegelijk (Quicksand + Fraunces is het maximum)

---

## 9. Schrijfstijl (voor alle tekst in de interface)

### Verboden

- **Nooit de em-dash (—)** gebruiken. Vervang door komma, puntkomma, dubbele punt, of herschrijf de zin.
- Geen AI-achtige openers: "Zeker!", "Absoluut!", "Geweldig!", "Natuurlijk!"
- Geen overdreven beleefdheidsformules
- Geen ellenlange alinea's zonder witruimte

### Toon

- Warm, toegankelijk, aanmoedigend
- Geen jargon of technisch taalgebruik zonder uitleg
- Korte zinnen, één punt per alinea
- De deelnemer wordt aangesproken met "je" en "jij", nooit "u"

### Systeeminstructie voor de AI-leercoach

Alle AI-feedback in de cursus gebruikt dit als basisinstructie:

```
Je bent een behulpzame en warme leercoach voor een e-learning over AI-gebruik 
in de sociale sector. Je spreekt de leerling aan met 'je'. Je reageert altijd 
in het Nederlands. Houd je aan de beoordelingsinstructie.
```

---

## 10. Voortgang en localStorage

| Key | Inhoud |
|-----|--------|
| `anthropic_api_key` | API-sleutel van de gebruiker |
| `voortgang_[les-id]` | `{ afgerond: true/false, antwoord: "..." }` |
| `module_[module-id]_voltooid` | `true` als alle lessen afgerond zijn |
| `api_calls_[datum]` | Aantal API-aanroepen vandaag (budgetbescherming) |
| `actieplan` | JSON-object met het persoonlijke actieplan van de deelnemer |

Voortgang wordt nooit naar een server gestuurd. Als iemand localStorage wist, verliest hij zijn voortgang. Dat is bewust geaccepteerd voor versie 1.

---

## 11. Componentoverzicht en verantwoordelijkheden

| Component | Verantwoordelijkheid |
|-----------|---------------------|
| `App.jsx` | Layout, actieve module bijhouden, voortgang laden uit localStorage |
| `Navigatie.jsx` | Zijbalk met alle modules, voortgangsindicator, hamburger-menu op mobiel |
| `ModuleWeergave.jsx` | Wrapper die de juiste module-component laadt op basis van actieve module |
| `LesBlok.jsx` | Rendert een les: theorie, video-placeholder, kennischeck, opdracht, feedback |
| `useAnthropicApi.js` | Alle API-aanroep logica, foutafhandeling, budgetlimiet |
| `useVoortgang.js` | Lezen en schrijven van voortgang in localStorage |

---

## 12. Module-specifieke bijzonderheden

### Module 0
- Heeft drie sub-schermen: Welkom, ApiKoppeling, ApiSucces
- ApiSucces maakt direct een API-aanroep voor een welkomstbericht
- Voltooiing wordt opgeslagen zodra ApiSucces is getoond

### Module 3
- Bevat een `PromptDemo` component met gesimuleerde (hardcoded) chatinterface
- Geen echte API-aanroep in PromptDemo, alles is vooraf gegenereerde tekst

### Module 4
- Lessen met `externe_tool_vereist: true` tonen een lichtblauw instructieblok boven de opdracht
- De conditie voor het instructieblok gebruikt het veld uit de JSON, nooit de module-ID of -naam

### Module 5
- Gebruikt jsPDF voor certificaatgeneratie
- De naam voor het certificaat wordt ingevoerd door de deelnemer, nooit automatisch geladen
- Na certificaatdownload wordt Module 5 als voltooid gemarkeerd

---

## 13. Veelgemaakte fouten om te vermijden

- De `beoordelingsinstructie` mag nooit worden gerenderd in de UI. Alleen als systeeminstructie in de API-aanroep.
- Nooit `localStorage`, `sessionStorage` of andere browser storage APIs gebruiken voor iets anders dan wat in sectie 10 staat.
- Nooit een API-aanroep doen bij een lege textarea (valideer altijd eerst via `trim()`).
- De `Content-Type` header is verplicht bij elke POST naar de Anthropic API. Vergeet hem niet.
- De `anthropic-dangerous-direct-browser-access: true` header is verplicht voor browser-aanroepen. Zonder hem werkt niets.
- Het model staat als constante `MODEL` bovenaan `useAnthropicApi.js`. Nooit elders hardcoden.

---

## 14. Werkwijze bij een taak

Volg bij elke taak deze volgorde:

1. Lees de taakomschrijving volledig
2. Controleer of de taak onder "zelfstandig uitvoeren" of "voorleggen" valt (secties 3 en 4)
3. Identificeer welke bestanden geraakt worden
4. Controleer of de beoordelingsinstructie nergens zichtbaar wordt voor de deelnemer
5. Controleer of er geen API-sleutels of persoonsgegevens in de code terechtkomen
6. Voer de wijziging uit conform de visuele stijl (sectie 8) en naamgevingsconventie (sectie 2)
7. Controleer of mobiele weergave intact is
8. Geef een beknopte samenvatting van wat je hebt gedaan en waarom

---

*Laatste update: mei 2026*
