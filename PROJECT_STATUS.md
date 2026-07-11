# PROJECT_STATUS — Werken met AI (e-learning)

> Overdracht voor de volgende Claude Code-sessie. Lees ook `CLAUDE.md` (werkinstructie) volledig.
> Laatste update: 2026-07-11 (didactische review verwerkt; daarvoor: ombouw naar Cloudflare-proxy met toegangscode)

## Technische review (verwerkt op 2026-07-11)

Volledige repo nagelopen als software engineer; gedrag en inhoud ongewijzigd. Verwerkt:

- **Hoofdbundle gehalveerd: 741,6 kB → 347,1 kB** (gzip 237 → 107 kB). jsPDF (390 kB) werd statisch geïmporteerd in `Module1.jsx` en `certificaatPdf.js` maar is alleen nodig bij twee downloadacties; beide gebruiken nu een dynamische `import('jspdf')` zodat Vite er een aparte lazy chunk van maakt die pas bij de eerste PDF-download laadt. `genereerCertificaatPdf` is daardoor async geworden. De chunk-size-waarschuwing van Vite is weg. In de preview bevestigd dat de jspdf-chunk pas ná de download-klik wordt opgehaald en beide downloads foutloos draaien.
- **`ModuleAfsluiting` ontdubbeld**: het identieke afsluitblok stond vier keer gekopieerd in Module1 t/m Module4; nu één gedeeld component `components/ModuleAfsluiting.jsx`.
- **Dubbele downloadlogica in Module5 ontdubbeld**: bestandsnaam-opbouw + save stond zowel in het certificaatscherm als bij "Download opnieuw"; nu één helper `downloadCertificaat(naam, data)` in `certificaatPdf.js`.
- **`useVoortgang.getLesVoortgang` gehardend**: een corrupt `voortgang_*`-item in localStorage gooide voorheen een onafgevangen `JSON.parse`-fout die de hele app wit trok; nu try/catch met schone fallback.

## Designreview (verwerkt op 2026-07-11)

Na de didactische review is de cursus nagelopen als webdesigner (met het Saliegroen-designsysteem als toetssteen), gemeten in de gerenderde DOM op 375px en 1280px. De basis bleek sterk: geen overflow meer op mobiel (de eerder gedocumenteerde kleurwissel-kop-overflow bij "Goede prompts schrijven" is door het herontwerp van commit fce5122 al opgelost), contrast overal binnen de merkwaarden, consistente lestitels/ritme (56px), correcte schaduwen en radii, nette navigatie-overlay met backdrop. Twee defecten gevonden en verwerkt:

- **Certificaat-voorvertoning was onleesbaar op mobiel**: de `cqw`-schaling van de A4-miniatuur duwde alle tekst naar 4-7px op 375px. Onder 560px schakelt de voorvertoning nu om naar een compacte weergave: zijbalk verborgen, natuurlijke hoogte, vaste leesbare fontgroottes (9-24px). Desktop blijft de exacte A4-miniatuur (ratio 1.414); de PDF zelf is onaangetast.
- **Toegangscode-veld**: was nog `type="password"` (erfenis van het sleutelscherm; maskering verbergt typefouten terwijl de code geen persoonlijk geheim is) en 43px hoog. Nu `type="text"` met `min-height: 48px`, conform de 48px-norm van de stijlgids.

## Didactische review (verwerkt op 2026-07-11)

Na de proxy-ombouw is de volledige cursusinhoud nagelopen vanuit onderwijskundig oogpunt. Verwerkt:

- **Certificaat vergrendeld** tot module 1 t/m 4 voltooid zijn: het certificaat claimt "alle opdrachten voltooid" en was voorheen zonder enige voortgang te downloaden. De downloadknop maakt nu plaats voor een rustige sage-melding (`.m5-cert-vergrendeld`) met de titels van de openstaande modules; `ModuleWeergave` geeft daarvoor `modules` door aan `Module5`, met tekst uit `certificaat.vergrendeld_tekst`. Getest in de preview: gedeeltelijk voltooid → melding met precies de juiste openstaande modules; alles voltooid → downloadknop terug.
- **Kennischeck module 1 les 2**: het juiste antwoord was veel langer dan de afleiders (klassieke weggever); optielengtes gebalanceerd, juiste antwoord blijft index 2.
- **Kennischeck module 3 les 1** had 3 opties waar de rest van de cursus er 4 heeft; "Alleen CONTEXT" toegevoegd als vierde afleider (correct blijft index 2).
- **Module 2 les 1**: `situatie_vraag` was bijna identiek aan de kennischeck-vraag erna; nu een activerende denk-eerst-na-regel.
- **Module 2 les 3**: de casus-mevrouw De Vries had hetzelfde bedrag (1.240 euro) als mevrouw Bakker uit les 1 (kopie-artefact dat suggereerde dat het dezelfde persoon was); nu 1.480 euro.
- **Module 4 rode draad**: twee praktische drempels weggenomen: (1) expliciet benoemd dat claude.ai/chatgpt.com een gratis account vereisen en dat de deelnemer dat eerst moet aanmaken; (2) tip toegevoegd om het AI-tabblad open te houden omdat oefening 3 voortbouwt op oefening 1 en 2 (stond nergens en zou deelnemers klem zetten). Les 4-3 opdrachttekst verwijst er nu ook naar.
- **Module 0 duur**: 20 → 10 minuten (de toegangscode-invoer verving de account-registratie bij Anthropic; 20 min klopte niet meer).

---

## Waar staan we

**Alle modules (0 t/m 5) zijn volledig gebouwd én de cursus is omgebouwd naar het proxy-model.** De deelnemer koppelt geen eigen Anthropic-sleutel meer; hij voert een toegangscode in (uitgedeeld door de eigenaar) en al het AI-verkeer loopt via de Cloudflare Worker in `proxy/`. De browser bevat nooit meer een Anthropic-sleutel.

**Het enige dat nog ontbreekt om de cursus volledig werkend te krijgen:** de `ANTHROPIC_API_KEY`-secret op de Worker. De eigenaar heeft betalingsproblemen bij Anthropic en kijkt daar morgen (11 juli) opnieuw naar. Zodra die secret staat, werkt alles end-to-end; er hoeft dan niets meer gebouwd te worden. Zie "Nog te doen".

De ombouw van deze sessie (zie "Ombouw naar de proxy" hieronder) raakt: `useAnthropicApi.js` (volledig herschreven), `ApiKoppeling.jsx` (nu een toegangscode-scherm), teksten in `Welkom.jsx`/`ApiSucces.jsx`/`cursus.json`, de reset in `Module5.jsx`, en de secties 1, 2, 5, 6, 10, 12 en 13 van `CLAUDE.md` (die beschreven het oude sleutel-model en zijn bijgewerkt zodat volgende sessies correct bouwen).

### Ombouw naar de proxy (deze sessie)

- **`src/hooks/useAnthropicApi.js`** — volledig herschreven. `stuurVerzoek(bericht, beoordelingsinstructie, maxTokens)` heeft dezelfde signatuur maar POST nu naar de proxy (`.../chat`) met `{toegangscode, bericht, systeeminstructie, max_tokens}`. Model en temperature zijn uit de cursus-code verdwenen (de proxy bepaalt die). De `SYSTEM_BASE`-samenvoeging bleef in de cursus. Exporteert `TOEGANGSCODE_KEY` (`"toegangscode"`) en `controleerToegangscode(code)`.
- **Toegangscode-validatie zonder AI-kosten:** `controleerToegangscode` stuurt bewust een leeg `bericht`; de proxy checkt de code vóór de bericht-validatie en vóór de daglimiet, dus 401 = code fout, 400 = code goed, zonder Anthropic-aanroep en zonder limiet-tik.
- **Foutafhandeling:** proxy-fouten hebben een Nederlands `fout`-veld, dat gebruikt de hook om te onderscheiden: 401 over de toegangscode → code wordt gewist + "Je toegangscode klopt niet. Vul hem opnieuw in via module 0."; 429 over de dagelijkse limiet → "De cursus heeft vandaag zijn maximum aan AI-vragen bereikt..."; 429 overig → wacht-even-melding; netwerk → geen-verbinding; al het andere (ook doorgegeven Anthropic-fouten, zoals een ontbrekende/ongeldige sleutel op de Worker) → generieke melding.
- **Kostenwaarschuwing verwijderd** (`api_aanroepen_totaal`, `kostenwaarschuwing_getoond`, het melding-blok in `OpdrachtFeedback`): de tekst ging over het eigen startkrediet van de deelnemer en dat model bestaat niet meer. De proxy-daglimiet (60/dag per code) vervangt dit functioneel.
- **`ApiKoppeling.jsx`** — het 5-stappen Anthropic-Console-scherm is vervangen door een eenvoudig 2-stappen toegangscode-scherm. Valideert live bij de proxy vóór opslag; toont "Code controleren..." tijdens de check. Ruimt een eventueel achtergebleven `anthropic_api_key` uit het oude model actief op. Het "al verbonden"-scherm (code eindigt op ···xxxx, wijzigen/verwijderen/doorgaan) bleef qua opzet gelijk.
- **Teksten** in `Welkom.jsx` (CTA + "Wat heb je nodig?"), `ApiSucces.jsx` (welkomstprompt + "Code opnieuw invoeren") en de module 0-beschrijving in `cursus.json` spreken nu over de toegangscode.
- **`Module5.jsx`** — "Begin opnieuw" bewaart de toegangscode over de reset heen (de code is geen voortgang; zo hoeft de deelnemer hem niet opnieuw op te vragen).
- **`CLAUDE.md`** — secties 1 (tech stack), 2 (mappenstructuur incl. `proxy/`), 5 (veiligheidsregels), 6 (volledig herschreven: proxy-contract, foutafhandelingstabel, daglimiet i.p.v. kostenwaarschuwing, `controleerToegangscode`), 10 (localStorage-tabel), 12 (module 0) en 13 (veelgemaakte fouten) bijgewerkt naar het proxy-model.

### Status van de proxy

- **Live:** `https://werken-met-ai-proxy.timonmariuskool.workers.dev` (endpoint: `POST /chat`).
- **Wat werkt en is getest (met curl, zonder Anthropic-sleutel):** toegangscode-check (401 bij mismatch), leeg-berichtvalidatie (400), onbekend pad (404), verkeerde methode (405), CORS (alleen `https://timonkool.nl`, `https://timonkool.github.io`, `http://localhost:5173` en `null` krijgen `Access-Control-Allow-Origin` terug).
- **Wat nog niet getest is:** de daadwerkelijke doorschakeling naar Anthropic. Dit vereist de `ANTHROPIC_API_KEY`-secret, die de eigenaar nog niet kon zetten (saldo moest nog verwerkt worden).
- **Secrets:**
  - `TOEGANGSCODE` — **ingesteld** (willekeurig gegenereerde waarde, alleen bekend bij de eigenaar; niet in de repo of in dit document).
  - `ANTHROPIC_API_KEY` — **nog niet ingesteld**. Zodra de eigenaar zijn Anthropic-sleutel heeft, zet hij die zelf met:
    ```
    cd proxy
    CLOUDFLARE_API_TOKEN=<zijn-cloudflare-token> npx wrangler secret put ANTHROPIC_API_KEY
    ```
    (plakt de Anthropic-sleutel als er om gevraagd wordt). Daarna pas kan de volledige doorschakeling naar Anthropic getest worden, bijvoorbeeld via `proxy/test.html`.
- **KV-namespace:** `RATE_LIMIT_KV` (id `11bb2f5f3c7d406d959e6a8193c56602`), gebruikt voor de daglimiet van 60 aanroepen per toegangscode per dag (UTC-datum in de sleutel, TTL 2 dagen).
- **Documentatie:** zie `proxy/README.md` voor de exacte request-/response-vorm, inclusief voorbeelden voor de flyer-aanroep (4000 tokens) en een gewone feedback-aanroep (800 tokens). Dat document is het uitgangspunt voor de volgende stap.

## Live & deployment

- **GitHub repo:** `timonkool/werken-met-ai-elearning`, branch `master`.
- **Live op:** https://timonkool.nl/elearning-ai-voor-beginners
- **Hoe:** elke push naar `master` triggert `.github/workflows/deploy.yml`. Die bouwt de Vite-app en kopieert `dist/` naar de submap `elearning-ai-voor-beginners/` in de website-repo `timonkool.github.io` (branch `main`).
- De kopieer-stap gebruikt het secret `WEBSITE_DEPLOY_TOKEN` (al ingesteld in de repo).
- `vite.config.js` heeft `base: '/elearning-ai-voor-beginners/'` — niet wijzigen zonder reden.
- Afspraak met eigenaar: alle wijzigingen meteen live zetten, **maar pas na zijn goedkeuring**. Deze sessie is die goedkeuring expliciet gegeven ("bouw module 5 en push alles"); module 1 t/m 5 zijn dus in deze sessie voor het eerst naar `master` gepusht.

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
- **Module 5** (`modules/module-5/Module5.jsx`, geen AI-aanroep in deze module):
  - **5.1 Terugblik** (`Terugblik`): kernzin per module (1–4) uit `module.terugblik.kernzinnen`, afsluittekst, knop naar het actieplan.
  - **5.2 Actieplan** (`Actieplan`): drie vrije tekstvelden (`module.actieplan.vragen`), knop "Bewaar mijn actieplan" slaat op als JSON-object onder `localStorage["actieplan"]`. Na opslaan verschijnt bevestiging + knop naar het certificaat.
  - **5.3 Certificaat** (`Certificaat` + `CertificaatVoorvertoning`): naaminvoer (leegte-validatie: "Vul eerst je naam in.", zelfde patroon als elders in de cursus) met live voorvertoning die het referentieontwerp (`context/Voorbeeld_certificaat.html`) volgt — saliegroene zijbalk, kader, naam, prestatietekst, modulepillen, handtekening, zegel en datum. De voorvertoning schaalt via CSS **container query units** (`cqw` op een element met `container-type: inline-size`) zodat de verhoudingen exact kloppen op elke breedte, van 720px desktop tot mobiel.
  - **5.4 Eindscherm** (`Eindscherm`): overzicht van de kernzinnen, "Download mijn certificaat opnieuw" en "Begin opnieuw". "Begin opnieuw" toont eerst een **inline bevestigingsblok** (geen browser-`confirm()`, consistent met de rest van de cursus) en wist bij bevestiging **alle** `localStorage` (`localStorage.clear()`) gevolgd door een reload, wat de deelnemer terugbrengt naar de allereerste startpagina.
  - **`certificaatPdf.js`** — losse jsPDF-helper (`genereerCertificaatPdf(naam, certificaatData)`) die het certificaat als A4-liggend PDF genereert met vector-tekenprimitieven (rect/circle/triangle/text), visueel gebaseerd op dezelfde referentie. Wordt aangeroepen vanuit zowel het certificaatscherm als "Download opnieuw" in het eindscherm.
  - Module 5 onthoudt bij binnenkomst waar de deelnemer gebleven was: voltooid → eindscherm, actieplan al opgeslagen maar nog geen certificaat → certificaatscherm, anders → terugblik.
- **CSS** — alle nieuwe klassen toegevoegd onderaan `globals.css`, strikt binnen de saliegroen/cream + klei-palette (plus het nieuwe gedempte `--lucht-*` blauw, uitsluitend voor het module 4-instructieblok). Mobiel: flyer/kaarten/herkenning stapelen onder 768px; prompt-demo, element-kaarten en bonus krijgen smallere padding; m4-intro en casuskaders krijgen smallere padding; module 5 heeft geen aparte mobiele overrides nodig voor het certificaat omdat de `cqw`-schaling dat automatisch afhandelt.

## Lokaal getest deze sessie (preview)

- Build is schoon (`npm run build`), geen console-errors. 455 modules, geen nieuwe waarschuwingen.
- Alle vier module 5-schermen doorlopen in de draaiende preview (`npm run dev`), zonder API-sleutel nodig:
  - Terugblik toont de vier kernzinnen correct.
  - Actieplan: drie velden ingevuld, "Bewaar mijn actieplan" schrijft het juiste JSON-object naar `localStorage["actieplan"]`, bevestigingstekst en vervolgknop verschijnen.
  - Certificaat: leegte-validatie getest (foutmelding "Vul eerst je naam in." bij leeg veld, verdwijnt zodra je typt); voorvertoning update live met de ingevulde naam; container-query-schaling geverifieerd via computed styles (naam-fontsize schaalt correct mee met de breedte van de voorvertoning, geen horizontale overflow).
  - Download certificaat (PDF) getest: geen JavaScript-fouten in de console, `module_module-5_voltooid` en `certificaat_naam` worden correct gezet, app springt automatisch door naar het eindscherm.
  - Eindscherm: "Download mijn certificaat opnieuw" opnieuw getest zonder fouten; "Begin opnieuw" → bevestigingsblok → "Ja, alles wissen" wist `localStorage` volledig en brengt de deelnemer terug naar de startpagina.
  - Hervat-logica getest: met alleen een opgeslagen actieplan (geen certificaat) opent module 5 direct op het certificaatscherm.
- Mobiel (375px): geen horizontale overflow (`document.body.scrollWidth === window.innerWidth`).
- **Niet getest (kon niet, geen API-sleutel beschikbaar deze sessie):** de AI-feedback in module 1 les 4, module 2 les 3, module 3 les 3–4, module 4 les 1–3. Die code is dit keer niet gewijzigd. De eigenaar test dit zelf zodra hij tijd heeft; als er iets misgaat, ligt dat aan bestaande code, niet aan het werk van deze sessie.

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

1. **`ANTHROPIC_API_KEY`-secret zetten op de proxy** (eigenaar, zodra de betaling bij Anthropic is opgelost — hij kijkt er 11 juli opnieuw naar):
   ```
   cd proxy
   CLOUDFLARE_API_TOKEN=<zijn-cloudflare-token> npx wrangler secret put ANTHROPIC_API_KEY
   ```
   Dit is de **enige** ontbrekende schakel; er hoeft verder niets gebouwd te worden.
2. **End-to-end testen zodra de secret staat** (eigenaar, met zijn eigen toegangscode): module 0 doorlopen (code invoeren → welkomstbericht), de flyer in module 1 les 1, en minstens één feedback-opdracht (bv. module 1 les 4). Wat er zonder secret gebeurt: de code-validatie en alle schermen werken gewoon, maar een echte AI-aanroep geeft de generieke foutmelding (Anthropic-401 door de ontbrekende sleutel op de Worker).
3. **Toegangscode uitdelen aan deelnemers** zodra alles getest is. De code staat als `TOEGANGSCODE`-secret op de Worker en is alleen bij de eigenaar bekend. Let op: de daglimiet (60 aanroepen/dag) geldt per code, dus gedeeld over iedereen die dezelfde code gebruikt. Bij grotere groepen is dat een aandachtspunt (limiet verhogen in `proxy/src/index.js` of meerdere codes ondersteunen; dat laatste vergt een Worker-aanpassing).
4. **`.claude/skills/` en `context/Claude code skills/` staan nog untracked** (Saliegroen-designsysteem-skill, dubbel op twee plekken). Dit is Claude Code-tooling, geen cursusinhoud, en is bewust **niet** meegecommit. Opruimen of alsnog toevoegen is aan de eigenaar.

## Belangrijke aandachtspunten (algemeen)

- `beoordelingsinstructie` uit `cursus.json` **nooit** in de UI tonen; alleen als systeeminstructie in de API (gaat via `OpdrachtFeedback` → `stuurVerzoek`).
- Geen sleutels/codes/persoonsgegevens in code. De Anthropic-sleutel staat alleen als secret op de Worker; de toegangscode van de deelnemer alleen in `localStorage` (`toegangscode`).
- Stijl: saliegroen, geen em-dash (—), aanspreken met "je". Zie `stijlgids zacht groen.md` en `schrijfstijl_instructie.md`.
- `node_modules`/`dist` staan in `.gitignore` — bij verse checkout eerst `npm install`.
- Build verifiëren met `npm run build` vóór elke push.
- Lokaal draaien: `npm run dev` (of de Preview-tool via `.claude/launch.json`, naam `dev`, poort 5173). App-URL: `/elearning-ai-voor-beginners/`.
