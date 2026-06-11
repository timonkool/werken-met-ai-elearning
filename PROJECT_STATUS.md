# PROJECT_STATUS — Werken met AI (e-learning)

> Overdracht voor de volgende Claude Code-sessie. Lees ook `CLAUDE.md` (werkinstructie) volledig.
> Laatste update: 2026-06-11 (sessie: API-sync + LesBlok)

---

## Waar staan we

Module 0 is volledig af. Modules 1 t/m 5 bestaan alleen als lege hulls in `cursus.json` (titel, duur, kleur, beschrijving, lege `lessen: []`). De cursusinhoud zelf moet nog gebouwd worden.

## Live & deployment

- **GitHub repo:** `timonkool/werken-met-ai-elearning`, branch `master`.
- **Live op:** https://timonkool.nl/elearning-ai-voor-beginners
- **Hoe:** elke push naar `master` triggert `.github/workflows/deploy.yml`. Die bouwt de Vite-app en kopieert `dist/` naar de submap `elearning-ai-voor-beginners/` in de website-repo `timonkool.github.io` (branch `main`).
- De kopieer-stap gebruikt het secret `WEBSITE_DEPLOY_TOKEN` (al ingesteld in de repo).
- `vite.config.js` heeft `base: '/elearning-ai-voor-beginners/'` — niet wijzigen zonder reden.
- Afspraak met eigenaar: alle wijzigingen meteen live zetten, **maar pas na zijn goedkeuring**.

## Wat is gebouwd (klaar)

- **`cursus.json`** — meta + 6 modules met eigen kleur/duur/beschrijving. Lessen nog leeg.
- **Navigatie** (`components/Navigatie.jsx`) — zijbalk desktop, hamburger-overlay mobiel, voortgangsbalk + groen vinkje per module.
- **ModuleWeergave** (`components/ModuleWeergave.jsx`) — kleurwissel-kop; routeert `module-0` naar `Module0`, rest naar placeholder ("Inhoud volgt binnenkort") met "Volgende module".
- **App.jsx** — layout, startpagina, actieve module in `localStorage` (`actieve_module`), herstelt waar gebruiker was.
- **Module 0** (3 sub-schermen in `modules/module-0/`):
  - `Welkom.jsx` — hero, drie intro-blokken, 6 modulekaartjes, "Start de cursus".
  - `ApiKoppeling.jsx` — 5-staps uitleg API-sleutel, invoerveld, sleutelbeheer (wijzigen/verwijderen) via React-state.
  - `ApiSucces.jsx` — roept AI aan voor welkomstbericht, toont laden/fout/antwoord, "Start module 1".
  - `Module0.jsx` — verbindt de drie schermen, markeert `module-0` voltooid bij successcherm.
- **`hooks/useAnthropicApi.js`** — `stuurVerzoek(bericht, beoordelingsinstructie, maxTokens)`. Model nu **`claude-sonnet-4-6`**, standaard **800 tokens** (derde param overschrijft per aanroep, bv. 4000 voor de flyer in module 1), temp 0.4. **Geen daglimiet meer.** In plaats daarvan een totaalteller (`api_aanroepen_totaal`); bij 50 aanroepen verschijnt eenmalig een kostenmelding (`kostenWaarschuwing` + `setKostenWaarschuwing`, bewaakt via `kostenwaarschuwing_getoond`), die niets blokkeert. Wist sleutel bij 401, headers ongewijzigd.
- **`hooks/useVoortgang.js`** — gedeelde state via module-level luisteraars + `storage`-event. API: `getLesVoortgang`, `setLesVoortgang`, `isModuleVoltooid`, `setModuleVoltooid`.

## Nog te doen (volgende stappen)

1. **`LesBlok.jsx` is af.** Rendert theorie (react-markdown), kennischeck (goed=groen vinkje, fout=gedempt oranje + juiste optie groen, geen blokkade), opdracht (cream blok, ruim tekstveld) en AI-feedback via `stuurVerzoek` (beoordelingsinstructie als verborgen systeeminstructie, laadtekst "AI leest je antwoord...", grijze disclaimer, inklapbaar voorbeeldantwoord pas na versturen, knoppen "Pas mijn antwoord aan", "Markeer als afgerond"). Lege invoer → "Vul eerst je antwoord in", geen aanroep. Voortgang via `useVoortgang`. `ModuleWeergave` rendert nu `module.lessen` via `LesBlok` (placeholder als leeg).
   - **LET OP — tijdelijke testles:** in `cursus.json` staat onder module-1 één testles met id `les-test-voorbeeld` om alle vier de blokken te kunnen bekijken. **Verwijder deze** bij het bouwen van de echte module 1-inhoud.
2. **Modules 1–5 inhoud** — lessen vullen in `cursus.json` en weergeven. Volledige inhoud staat in `context/elearning_inhoud_volledig_v2.md` (v2 is leidend). **Begin met module 1 en 2.** Let op de bijzondere API-aanroepen: module 1 les 1 = HTML-flyer met `maxTokens` 4000 (apart component, geen standaard feedbackblok); module 1 les 3 = klikbare zinnen met verborgen fouten; module 3 les 1 = `PromptDemo` (hardcoded, geen API).
3. **Module 3** — `PromptDemo` component met hardcoded chat (geen echte API).
4. **Module 4** — lichtblauw instructieblok bij lessen met `externe_tool_vereist: true`.
5. **Module 5** — certificaat via jsPDF; voorbeeld in `context/Voorbeeld_certificaat.html`. Markeer voltooid na download.

## Belangrijke aandachtspunten

- `beoordelingsinstructie` uit `cursus.json` **nooit** in de UI tonen; alleen als systeeminstructie in de API.
- Geen API-sleutels/persoonsgegevens in code. Sleutel alleen in `localStorage` (`anthropic_api_key`).
- Stijl: saliegroen, geen em-dash (—), aanspreken met "je". Zie `stijlgids zacht groen.md` en `schrijfstijl_instructie.md`.
- `node_modules`/`dist` staan in `.gitignore` — bij verse checkout eerst `npm install`.
- Build verifiëren met `npm run build` vóór elke push.
