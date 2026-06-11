# PROJECT_STATUS — Werken met AI (e-learning)

> Overdracht voor de volgende Claude Code-sessie. Lees ook `CLAUDE.md` (werkinstructie) volledig.
> Laatste update: 2026-06-11 (sessie: module 4 gebouwd)

---

## Waar staan we

Module 0, 1, 2, 3 en 4 zijn volledig gebouwd. Module 5 bestaat nog als lege hull in `cursus.json` (titel, duur, kleur, beschrijving, lege `lessen: []`). De volgende stap is **module 5 + afwerking**.

## Live & deployment

- **GitHub repo:** `timonkool/werken-met-ai-elearning`, branch `master`.
- **Live op:** https://timonkool.nl/elearning-ai-voor-beginners
- **Hoe:** elke push naar `master` triggert `.github/workflows/deploy.yml`. Die bouwt de Vite-app en kopieert `dist/` naar de submap `elearning-ai-voor-beginners/` in de website-repo `timonkool.github.io` (branch `main`).
- De kopieer-stap gebruikt het secret `WEBSITE_DEPLOY_TOKEN` (al ingesteld in de repo).
- `vite.config.js` heeft `base: '/elearning-ai-voor-beginners/'` — niet wijzigen zonder reden.
- Afspraak met eigenaar: alle wijzigingen meteen live zetten, **maar pas na zijn goedkeuring**. Module 1 + 2 + 3 + 4 staan nog **niet** gepusht; wachten op goedkeuring.

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
- **Module 4** (`modules/module-4/Module4.jsx`):
  - **Introkader** (`IntroKader`): toont het in module 1 opgeslagen antwoord (`module1_eigen_taak`) als Fraunces-citaat. Wordt niet getoond als de sleutel leeg/afwezig is.
  - **4.0 De rode draad** (`RodeDraad`): uitlegscherm, geen opdracht. Twee alinea's + genummerde 5-stappenlijst + afsluitende na-tekst. Inhoud in `module.rode_draad`.
  - **Herbruikbaar instructieblok** (`Instructieblok`): gedempt lucht-blauw kader met de exacte tekst uit `module.instructieblok`. Verschijnt boven les 1–3 op conditie `les.externe_tool_vereist === true` (niet op module-id). Les 4 heeft `externe_tool_vereist: false` en toont het blok dus niet.
  - **Casus-informatie** (`Informatie`): `type: "lijst"` rendert het ruwe plan (les 1), `type: "mail"` rendert de mail van Marieke (les 2) en de statusupdate van Joost (les 3, met `intro`-regel). Alle casusteksten letterlijk uit de inhoudsbrief.
  - Les 1–3 — `OefeningLes`: informatie + instructieblok + standaard `OpdrachtFeedback` (AI-feedback op de aanpak). Les 1 opdrachttekst bevat expliciet de lengte-instructie "maximaal twee pagina's A4"; de system-prompt controleert of de deelnemer een lengte heeft opgegeven.
  - Les 4 — `EigenTaakLes`: **geen AI-aanroep**. Toont `tekst_met_taak_*` (met `module1_eigen_taak`) of `tekst_zonder`. Knop "Sla op voor mezelf" slaat op in `localStorage` onder `module4_eigen_prompt`. Daarna verschijnt "Sluit module 4 af" → markeert module-4 voltooid.
- **Module-afsluiting** — modules 1, 2, 3 en 4 tonen onderaan (zodra voltooid) een afsluitblok met `module.afsluittekst` + knop "Volgende module".
- **CSS** — alle nieuwe klassen toegevoegd onderaan `globals.css`, strikt binnen de saliegroen/cream + klei-palette (plus het nieuwe gedempte `--lucht-*` blauw, uitsluitend voor het module 4-instructieblok). Mobiel: flyer/kaarten/herkenning stapelen onder 768px; prompt-demo, element-kaarten en bonus krijgen smallere padding; m4-intro en casuskaders krijgen smallere padding.

## Lokaal getest deze sessie (preview)

- Build is schoon (`npm run build`), geen console-errors. 452 modules, geen nieuwe waarschuwingen.
- Module 4 rendert correct (geverifieerd via DOM-inspectie in de preview): introkader met het module 1-antwoord, de rode draad (5 stappen + na-tekst), het ruwe plan (8 punten), beide mails (Marieke + Joost), **3** instructieblokken (alleen les 1–3), **4** opdrachtblokken, en de eigen-taak met aanhaling + twee knoppen.
- **Introkader-conditie** getest: met `module1_eigen_taak` gevuld verschijnt het kader; leeg/afwezig → niet getoond.
- **Instructieblok-kleur** (`--lucht-mist` = rgb(231,238,242), rand rgb(124,151,168)) bevestigd: gedempt lucht-blauw, niet fel.
- **Eigen-taak-opslag** getest: "Sla op voor mezelf" schrijft naar `localStorage["module4_eigen_prompt"]`. ✓ (testwaarde daarna weer verwijderd)
- Mobiel (375px): geen horizontale overflow in `.module-body` (scrollWidth = 375). De casuskaders, instructieblokken en lijsten stapelen netjes.
- **Nog niet live getest: de AI-feedback in les 1–3.** Dit vereist de persoonlijke API-sleutel van de eigenaar (CLAUDE.md §5, alleen in de browser). Eigenaar test dit zelf in de draaiende dev-app. Het introkader, de rode draad, de casusweergave en de eigen-taak-opslag werken zonder sleutel.
- **Testdata in de dev-browser:** voor de controle staan `module1_eigen_taak` (gevraagd testantwoord) en de voltooid-vlaggen van module 0–3 nog in `localStorage`. Wis ze desgewenst handmatig of via "Begin opnieuw" (komt in module 5).

## Belangrijke beslissingen / aandachtspunten deze sessie

- **Flyer-system-prompt:** `stuurVerzoek` zet altijd `SYSTEM_BASE` (de leercoach-instructie) vóór de meegegeven instructie; bij de flyer komt de HTML-expert-prompt daar dus achter. De API-logica is **niet** gewijzigd (CLAUDE.md §4). Als waarborg wordt het antwoord vóór weergave door `extractHtml()` gehaald (knipt naar `<!DOCTYPE`/`<html`/eerste `<`, strip markdown-fences). Als de eigenaar de leercoach-preamble helemaal uit de flyer wil, is een schone optionele parameter in `useAnthropicApi` nodig — dat is een §4-wijziging en moet hij eerst goedkeuren.
- **Kleuren:** de inhoudsbrief noemt "lichtgeel/rood/oranje". CLAUDE.md §8 (stijlgids) is primair voor visuele regels en verbiedt felle kleuren. Daarom: selectie = `--sage-soft`, fout/waarschuwing = klei-palette (`--klei-*`, gedempt terracotta), goed = sage. Functionele intentie behouden, palet gerespecteerd.
- **cursus.json schema-uitbreiding:** voor de bijzondere lessen zijn extra velden toegevoegd (zie `meta._docs`). Dit is een uitbreiding, geen breuk van de standaardstructuur; bij twijfel met eigenaar afstemmen.
- **Module-voltooiing modules 1–5:** gebeurt nu in de module-component zelf (`setModuleVoltooid` bij de afrondactie van de laatste les). Houd dit patroon aan voor module 4–5.
- **Beoordelingsinstructies module 3 letterlijk overgenomen** uit de inhoudsbrief, maar **zonder** de openingszin "Je bent een (vriendelijke) promptcoach...". Reden: `stuurVerzoek` zet `SYSTEM_BASE` (de leercoach-rol) altijd ervoor, en modules 1 en 2 trimden die rol-introzin op dezelfde manier. Zo blijft het consistent en is er geen dubbele rol-toewijzing. Wil de eigenaar de "promptcoach"-framing toch expliciet, dan kan die zin terug in `cursus.json` (raakt alleen de systeeminstructie, niet de UI).
- **Beoordelingsinstructies module 4** op dezelfde manier behandeld: letterlijk uit de inhoudsbrief, maar **zonder** de openingszin "Je bent een coach voor vrijwilligers...". Consistent met module 1–3.
- **Lichtblauw instructieblok — bewuste afwijking van §8:** CLAUDE.md §8 verbiedt blauw, maar §12 (module-specifiek) **én** de inhoudsbrief schrijven een "lichtblauw instructieblok" voor module 4 expliciet voor. Opgelost als functionele uitzondering, net als de gekleurde randen van de cursusblokken in §8: een nieuw, **gedempt** lucht-blauw (`--lucht-mist/-rand/-ink`), geen fel blauw. Wil de eigenaar tóch volledig binnen sage/klei blijven, dan is het een kwestie van die drie variabelen ompunten naar bv. `--sage-soft/--sage/--sage-ink`.
- **Mobiel: kleurwissel-titel "Goede prompts schrijven" steekt ~20px buiten de viewport op 375px** (white-space: nowrap is verplicht voor de clip-path, stijlgids §8). Dit geldt voor elke langere moduletitel en is inherent aan de signature-kop, niet aan module 3. Niet aangepast omdat dit de beschermde signature-kop raakt (CLAUDE.md §4/§8, eerst voorleggen). Mogelijke opties als de eigenaar dit wil oplossen: titel iets kleiner schalen op mobiel, of de kop laten clampen/afkappen.

## Nog te doen (volgende stappen)

1. **Module 5** — vier schermen (zie inhoudsbrief §Module 5): terugblik (kernzin per module), actieplan (3 vrije velden, opslag `actieplan`), certificaat (naam-invoer + jsPDF, referentie `context/Voorbeeld_certificaat.html`), eindscherm met "Download opnieuw" + "Begin opnieuw" (wist alle voortgang na bevestiging). Markeer module-5 voltooid na certificaatdownload.
2. **Afwerking vóór push** — eigenaar test de AI-feedback van module 4 (les 1–3) met eigen sleutel; daarna goedkeuring → push module 1+2+3+4(+5) naar `master`.

## Belangrijke aandachtspunten (algemeen)

- `beoordelingsinstructie` uit `cursus.json` **nooit** in de UI tonen; alleen als systeeminstructie in de API (gaat via `OpdrachtFeedback` → `stuurVerzoek`).
- Geen API-sleutels/persoonsgegevens in code. Sleutel alleen in `localStorage` (`anthropic_api_key`).
- Stijl: saliegroen, geen em-dash (—), aanspreken met "je". Zie `stijlgids zacht groen.md` en `schrijfstijl_instructie.md`.
- `node_modules`/`dist` staan in `.gitignore` — bij verse checkout eerst `npm install`.
- Build verifiëren met `npm run build` vóór elke push.
- Lokaal draaien: `npm run dev` (of de Preview-tool via `.claude/launch.json`, naam `dev`, poort 5173). App-URL: `/elearning-ai-voor-beginners/`.
