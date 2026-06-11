# PROJECT_STATUS — Werken met AI (e-learning)

> Overdracht voor de volgende Claude Code-sessie. Lees ook `CLAUDE.md` (werkinstructie) volledig.
> Laatste update: 2026-06-11 (sessie: module 3 gebouwd)

---

## Waar staan we

Module 0, 1, 2 en 3 zijn volledig gebouwd. Modules 4 en 5 bestaan nog als lege hulls in `cursus.json` (titel, duur, kleur, beschrijving, lege `lessen: []`). De volgende stap is **module 4**.

## Live & deployment

- **GitHub repo:** `timonkool/werken-met-ai-elearning`, branch `master`.
- **Live op:** https://timonkool.nl/elearning-ai-voor-beginners
- **Hoe:** elke push naar `master` triggert `.github/workflows/deploy.yml`. Die bouwt de Vite-app en kopieert `dist/` naar de submap `elearning-ai-voor-beginners/` in de website-repo `timonkool.github.io` (branch `main`).
- De kopieer-stap gebruikt het secret `WEBSITE_DEPLOY_TOKEN` (al ingesteld in de repo).
- `vite.config.js` heeft `base: '/elearning-ai-voor-beginners/'` — niet wijzigen zonder reden.
- Afspraak met eigenaar: alle wijzigingen meteen live zetten, **maar pas na zijn goedkeuring**. Module 1 + 2 + 3 staan nog **niet** gepusht; wachten op goedkeuring.

## Wat is gebouwd (klaar)

- **`cursus.json`** — meta + 6 modules. Module 0 leeg (eigen schermen), **module 1 (4 lessen), module 2 (3 lessen) en module 3 (4 lessen) volledig gevuld** volgens `context/elearning_inhoud_volledig_v2.md`. Modules 4–5 nog leeg. De testles `les-test-voorbeeld` is verwijderd. `meta._docs.velden` documenteert de extra velden (`type`, `afsluittekst`, `citaat`, `eigenschappen`/`kolommen`, `flyer_systeeminstructie`, `afsluitvraag`, `originele_situatie`, `demo`, `elementen`, `bonus`).
- **Navigatie / ModuleWeergave / App** — ongewijzigd qua opzet. `ModuleWeergave` routeert nu `module-0` → `Module0`, `module-1` → `Module1`, `module-2` → `Module2`, `module-3` → `Module3` (binnen de standaard kleurwissel-kop), de rest → `LesBlok`-stapel of placeholder.
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
- **Module 3** (`modules/module-3/Module3.jsx`):
  - Les 1 — `ErvaarVerschilLes`: bevat de **`PromptDemo`**-component (3.1.A). Twee vaste standen (slecht/goed) met een toggle-knop, een gestileerd chatvenster (Jij/AI), gekleurde vlag (klei voor slecht, sage voor goed) en oordeel-regel. **Geen API-aanroep**, alle teksten staan vast in `cursus.json` onder `demo`. Daarna de reflectie-kennischeck (3.1.B, juist = C/index 2).
  - Les 2 — `DrieElementenLes`: drie uitlegkaarten ROL/TAAK/CONTEXT (`elementen`), kennischeck 3.2.B (**juist = A/index 0**), en de vijf bonustechnieken (`bonus`) als genummerde lijst.
  - Les 3 — `VerbeterPromptLes`: standaard `OpdrachtFeedback` (slechte prompt staat in `opdracht.tekst`).
  - Les 4 — `EigenPromptLes`: standaard `OpdrachtFeedback`, afrondknop "Bewaar mijn antwoord en sluit module 3 af" → markeert module-3 voltooid.
- **Module-afsluiting** — modules 1, 2 en 3 tonen onderaan (zodra voltooid) een afsluitblok met `module.afsluittekst` + knop "Volgende module".
- **CSS** — alle nieuwe klassen toegevoegd onderaan `globals.css`, strikt binnen de saliegroen/cream + klei-palette. Mobiel: flyer/kaarten/herkenning stapelen onder 768px; prompt-demo, element-kaarten en bonus krijgen smallere padding.

## Lokaal getest deze sessie (preview)

- Build is schoon (`npm run build`), geen console-errors. 451 modules, geen nieuwe waarschuwingen.
- Module 3 rendert correct: alle vier de lessen, de drie elementkaarten, de bonuslijst en beide opdrachtblokken.
- **PromptDemo:** toggle wisselt correct tussen stand 1 (slecht, klei-vlag "Vaag in = vaag uit", oordeel "Generiek...") en stand 2 (goed, sage-vlag "Specifiek in = bruikbaar uit", oordeel "Direct bruikbaar..."). Knoplabel wisselt mee. ✓
- **Kennischeck les 2** (juist = A) gecontroleerd: optie A markeert groen + "Goed gekozen." ✓
- Mobiel (375px): prompt-demo, kaarten en bonus stapelen netjes binnen de viewport (335px in 375px, geen overflow van de content). Enige horizontale overflow komt van de decoratieve kleurwissel-titel (zie aandachtspunt hieronder).
- **Nog niet live getest: de AI-feedback in les 3 en les 4.** Dit vereist de persoonlijke API-sleutel van de eigenaar (CLAUDE.md §5, alleen in de browser). Eigenaar test dit zelf in de draaiende dev-app. De PromptDemo en kennischecks werken zonder sleutel.

## Belangrijke beslissingen / aandachtspunten deze sessie

- **Flyer-system-prompt:** `stuurVerzoek` zet altijd `SYSTEM_BASE` (de leercoach-instructie) vóór de meegegeven instructie; bij de flyer komt de HTML-expert-prompt daar dus achter. De API-logica is **niet** gewijzigd (CLAUDE.md §4). Als waarborg wordt het antwoord vóór weergave door `extractHtml()` gehaald (knipt naar `<!DOCTYPE`/`<html`/eerste `<`, strip markdown-fences). Als de eigenaar de leercoach-preamble helemaal uit de flyer wil, is een schone optionele parameter in `useAnthropicApi` nodig — dat is een §4-wijziging en moet hij eerst goedkeuren.
- **Kleuren:** de inhoudsbrief noemt "lichtgeel/rood/oranje". CLAUDE.md §8 (stijlgids) is primair voor visuele regels en verbiedt felle kleuren. Daarom: selectie = `--sage-soft`, fout/waarschuwing = klei-palette (`--klei-*`, gedempt terracotta), goed = sage. Functionele intentie behouden, palet gerespecteerd.
- **cursus.json schema-uitbreiding:** voor de bijzondere lessen zijn extra velden toegevoegd (zie `meta._docs`). Dit is een uitbreiding, geen breuk van de standaardstructuur; bij twijfel met eigenaar afstemmen.
- **Module-voltooiing modules 1–5:** gebeurt nu in de module-component zelf (`setModuleVoltooid` bij de afrondactie van de laatste les). Houd dit patroon aan voor module 4–5.
- **Beoordelingsinstructies module 3 letterlijk overgenomen** uit de inhoudsbrief, maar **zonder** de openingszin "Je bent een (vriendelijke) promptcoach...". Reden: `stuurVerzoek` zet `SYSTEM_BASE` (de leercoach-rol) altijd ervoor, en modules 1 en 2 trimden die rol-introzin op dezelfde manier. Zo blijft het consistent en is er geen dubbele rol-toewijzing. Wil de eigenaar de "promptcoach"-framing toch expliciet, dan kan die zin terug in `cursus.json` (raakt alleen de systeeminstructie, niet de UI).
- **Mobiel: kleurwissel-titel "Goede prompts schrijven" steekt ~20px buiten de viewport op 375px** (white-space: nowrap is verplicht voor de clip-path, stijlgids §8). Dit geldt voor elke langere moduletitel en is inherent aan de signature-kop, niet aan module 3. Niet aangepast omdat dit de beschermde signature-kop raakt (CLAUDE.md §4/§8, eerst voorleggen). Mogelijke opties als de eigenaar dit wil oplossen: titel iets kleiner schalen op mobiel, of de kop laten clampen/afkappen.

## Nog te doen (volgende stappen)

1. **Module 4** — drie doorlopende oefeningen; lichtblauw instructieblok bij lessen met `externe_tool_vereist: true` (conditie op het JSON-veld, niet op module-id). Intro toont `module1_eigen_taak` uit localStorage. Casus-teksten staan in de inhoudsbrief.
2. **Module 5** — certificaat via jsPDF; voorbeeld in `context/Voorbeeld_certificaat.html`. Actieplan (3 velden, opslag `actieplan`). Markeer voltooid na download.

## Belangrijke aandachtspunten (algemeen)

- `beoordelingsinstructie` uit `cursus.json` **nooit** in de UI tonen; alleen als systeeminstructie in de API (gaat via `OpdrachtFeedback` → `stuurVerzoek`).
- Geen API-sleutels/persoonsgegevens in code. Sleutel alleen in `localStorage` (`anthropic_api_key`).
- Stijl: saliegroen, geen em-dash (—), aanspreken met "je". Zie `stijlgids zacht groen.md` en `schrijfstijl_instructie.md`.
- `node_modules`/`dist` staan in `.gitignore` — bij verse checkout eerst `npm install`.
- Build verifiëren met `npm run build` vóór elke push.
- Lokaal draaien: `npm run dev` (of de Preview-tool via `.claude/launch.json`, naam `dev`, poort 5173). App-URL: `/elearning-ai-voor-beginners/`.
