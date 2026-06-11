# PROJECT_STATUS — Werken met AI (e-learning)

> Overdracht voor de volgende Claude Code-sessie. Lees ook `CLAUDE.md` (werkinstructie) volledig.
> Laatste update: 2026-06-11 (sessie: module 1 + module 2 gebouwd)

---

## Waar staan we

Module 0, 1 en 2 zijn volledig gebouwd. Modules 3 t/m 5 bestaan nog als lege hulls in `cursus.json` (titel, duur, kleur, beschrijving, lege `lessen: []`). De volgende stap is **module 3**.

## Live & deployment

- **GitHub repo:** `timonkool/werken-met-ai-elearning`, branch `master`.
- **Live op:** https://timonkool.nl/elearning-ai-voor-beginners
- **Hoe:** elke push naar `master` triggert `.github/workflows/deploy.yml`. Die bouwt de Vite-app en kopieert `dist/` naar de submap `elearning-ai-voor-beginners/` in de website-repo `timonkool.github.io` (branch `main`).
- De kopieer-stap gebruikt het secret `WEBSITE_DEPLOY_TOKEN` (al ingesteld in de repo).
- `vite.config.js` heeft `base: '/elearning-ai-voor-beginners/'` — niet wijzigen zonder reden.
- Afspraak met eigenaar: alle wijzigingen meteen live zetten, **maar pas na zijn goedkeuring**. Module 1 + 2 staan nog **niet** gepusht; wachten op goedkeuring.

## Wat is gebouwd (klaar)

- **`cursus.json`** — meta + 6 modules. Module 0 leeg (eigen schermen), **module 1 (4 lessen) en module 2 (3 lessen) volledig gevuld** volgens `context/elearning_inhoud_volledig_v2.md`. Modules 3–5 nog leeg. De testles `les-test-voorbeeld` is verwijderd. `meta._docs.velden` documenteert de extra velden (`type`, `afsluittekst`, `citaat`, `eigenschappen`/`kolommen`, `flyer_systeeminstructie`, `afsluitvraag`, `originele_situatie`).
- **Navigatie / ModuleWeergave / App** — ongewijzigd qua opzet. `ModuleWeergave` routeert nu `module-0` → `Module0`, `module-1` → `Module1`, `module-2` → `Module2` (binnen de standaard kleurwissel-kop), de rest → `LesBlok`-stapel of placeholder.
- **Module 0** (3 sub-schermen) — ongewijzigd.
- **Herbruikbare lescomponenten (nieuw, geëxtraheerd uit LesBlok):**
  - `components/Kennischeck.jsx` — zelfstandig, eigen state, optionele `onBeantwoord(i)` callback (modules markeren les afgerond bij beantwoorden).
  - `components/OpdrachtFeedback.jsx` — het volledige AI-feedbackpatroon (verstuur, laden, fout+opnieuw, feedbackblok, disclaimer, inklapbaar voorbeeldantwoord, "pas aan", afrondknop). Props: `lesId`, `opdracht`, `inleiding`, `placeholder`, `afrondLabel`, `onAfgerond`, `renderNaFeedback`. Toont ook de eenmalige kostenmelding.
  - `components/LesBlok.jsx` — vereenvoudigd; rendert theorie + `Kennischeck` + `OpdrachtFeedback` voor standaard lessen.
- **Module 1** (`modules/module-1/Module1.jsx`, alle sub-componenten in één bestand):
  - Les 1 — `FlyerLes`: tweedeling Zonder AI / Met AI, bewerkbaar promptveld, knop "Maak mijn flyer →" → `stuurVerzoek(prompt, flyer_systeeminstructie, 4000)`. Antwoord wordt via `extractHtml()` ontdaan van eventuele preamble/codeblok en in een `<iframe srcDoc sandbox="">` getoond. Stopwatch + "Kopieer HTML-code". Daarna reflectievraag (opslag `module1_les1_reflectie`) en de 6 herkenningskaartjes.
  - Les 2 — `HoeWerktAiLes`: citaat-analogie (Fraunces italic), twee eigenschappenkaarten, kennischeck.
  - Les 3 — `KlikbareZinnenLes`: document met 7 zinnen (3 fout: idx 1/2/6), per zin klikbaar; "Bekijk welke zinnen niet kloppen" kleurt fout=klei, fout+gekozen=sterker, goed+gekozen=sage, met uitleg per foutieve zin. Bewaarkaartje + PDF-download via jsPDF. Kennischeck.
  - Les 4 — `EersteOpdrachtLes`: `OpdrachtFeedback` + afsluitvraag (opslag `module1_eigen_taak`); afrondknop "Bewaar mijn antwoord en sluit module 1 af" markeert module-1 voltooid.
- **Module 2** (`modules/module-2/Module2.jsx`):
  - Les 1 — situatieschets (Fatima) + kennischeck + overbruggingstekst.
  - Les 2 — gouden regel (groen blok, Fraunces italic) + uitleg + twee-kolommenkaart + kennischeck.
  - Les 3 — anonimiseeropdracht: `OpdrachtFeedback` met `originele_situatie` als inleiding; afronden markeert module-2 voltooid.
- **Module-afsluiting** — beide modules tonen onderaan (zodra voltooid) een afsluitblok met `module.afsluittekst` + knop "Volgende module".
- **CSS** — alle nieuwe klassen toegevoegd onderaan `globals.css`, strikt binnen de saliegroen/cream + klei-palette. Mobiel: flyer/kaarten/herkenning stapelen onder 768px.

## Lokaal getest deze sessie (preview)

- Build is schoon (`npm run build`), geen console-errors.
- Module 1 + 2 renderen correct op desktop (1280px, twee kolommen) en mobiel (<768px, gestapeld).
- Klikbare zinnen: onthullen markeert exact de 3 foutieve zinnen + 3 uitlegblokken. ✓
- Kennischeck: juiste optie groen + uitleg. ✓
- PDF-download van het bewaarkaartje werkt zonder fout. ✓
- **Nog niet live getest: de echte flyergeneratie + AI-feedback.** Dit vereist de persoonlijke API-sleutel van de eigenaar, die volgens CLAUDE.md §5 alleen in de browser hoort en niet in een chat/transcript. Eigenaar test dit zelf in de draaiende dev-app (sleutel invoeren in module 0 → module 1 → "Maak mijn flyer").

## Belangrijke beslissingen / aandachtspunten deze sessie

- **Flyer-system-prompt:** `stuurVerzoek` zet altijd `SYSTEM_BASE` (de leercoach-instructie) vóór de meegegeven instructie; bij de flyer komt de HTML-expert-prompt daar dus achter. De API-logica is **niet** gewijzigd (CLAUDE.md §4). Als waarborg wordt het antwoord vóór weergave door `extractHtml()` gehaald (knipt naar `<!DOCTYPE`/`<html`/eerste `<`, strip markdown-fences). Als de eigenaar de leercoach-preamble helemaal uit de flyer wil, is een schone optionele parameter in `useAnthropicApi` nodig — dat is een §4-wijziging en moet hij eerst goedkeuren.
- **Kleuren:** de inhoudsbrief noemt "lichtgeel/rood/oranje". CLAUDE.md §8 (stijlgids) is primair voor visuele regels en verbiedt felle kleuren. Daarom: selectie = `--sage-soft`, fout/waarschuwing = klei-palette (`--klei-*`, gedempt terracotta), goed = sage. Functionele intentie behouden, palet gerespecteerd.
- **cursus.json schema-uitbreiding:** voor de bijzondere lessen zijn extra velden toegevoegd (zie `meta._docs`). Dit is een uitbreiding, geen breuk van de standaardstructuur; bij twijfel met eigenaar afstemmen.
- **Module-voltooiing modules 1–5:** gebeurt nu in de module-component zelf (`setModuleVoltooid` bij de afrondactie van de laatste les). Houd dit patroon aan voor module 3–5.

## Nog te doen (volgende stappen)

1. **Module 3 — Goede prompts schrijven (4 lessen).** Les 1 = `PromptDemo`: gesimuleerde (hardcoded) chat met toggle slecht/goed, **geen echte API**; daarna reflectie-kennischeck. Les 2 = drie uitlegkaarten (ROL/TAAK/CONTEXT) + 5 bonustechnieken + kennischeck. Les 3 en 4 = standaard `OpdrachtFeedback` (prompt verbeteren / eigen prompt). Volledige inhoud in `context/elearning_inhoud_volledig_v2.md`.
2. **Module 4** — drie doorlopende oefeningen; lichtblauw instructieblok bij lessen met `externe_tool_vereist: true` (conditie op het JSON-veld, niet op module-id). Intro toont `module1_eigen_taak` uit localStorage. Casus-teksten staan in de inhoudsbrief.
3. **Module 5** — certificaat via jsPDF; voorbeeld in `context/Voorbeeld_certificaat.html`. Actieplan (3 velden, opslag `actieplan`). Markeer voltooid na download.

## Belangrijke aandachtspunten (algemeen)

- `beoordelingsinstructie` uit `cursus.json` **nooit** in de UI tonen; alleen als systeeminstructie in de API (gaat via `OpdrachtFeedback` → `stuurVerzoek`).
- Geen API-sleutels/persoonsgegevens in code. Sleutel alleen in `localStorage` (`anthropic_api_key`).
- Stijl: saliegroen, geen em-dash (—), aanspreken met "je". Zie `stijlgids zacht groen.md` en `schrijfstijl_instructie.md`.
- `node_modules`/`dist` staan in `.gitignore` — bij verse checkout eerst `npm install`.
- Build verifiëren met `npm run build` vóór elke push.
- Lokaal draaien: `npm run dev` (of de Preview-tool via `.claude/launch.json`, naam `dev`, poort 5173). App-URL: `/elearning-ai-voor-beginners/`.
