# Inhoudsbrief: Werken met AI — Volledige e-learning

**Versie:** 2.0  
**Datum:** Juni 2026  
**Auteur:** Timon Kool, timonkool.nl  
**Bestemd voor:** Claude Code als bouwinstructie en voor menselijke review

---

## Leeswijzer voor Claude Code

Dit document beschrijft de volledige inhoud van de e-learning "Werken met AI". Het is de inhoudelijke leidraad voor alle modules en lessen. Voor technische bouwregels (stijlgids, API-instellingen, mappenstructuur) geldt CLAUDE.md als primaire bron. Dit document gaat over WAT er gebouwd wordt, niet HOE de code eruit ziet.

**Conventies in dit document:**

- `[SYSTEM-PROMPT]` markeert de beoordelingsinstructie die uitsluitend naar de AI gaat. Deze tekst wordt nooit zichtbaar gemaakt voor de deelnemer.
- `[VOORBEELDANTWOORD]` markeert de tekst die verborgen is achter een inklapknop, pas beschikbaar nadat de deelnemer zijn eigen antwoord heeft verstuurd.
- `[VIDEO]` markeert een plek waar een videofragment wordt afgespeeld.
- `[AI-AANROEP]` markeert een moment waarop de functie `stuurVerzoek` wordt aangeroepen.
- Tekst tussen dubbele rechte haken `[[zoals dit]]` is een variabele die dynamisch wordt ingevuld vanuit eerder opgeslagen browserdata.

---

## Technische kernafspraken (geldig voor de hele cursus)

### API-instellingen

- Model: `claude-sonnet-4-6`
- Max tokens voor feedbacktaken: `800`
- Max tokens voor de HTML-flyergeneratie (module 1, les 1): `4000`
- Temperatuur: `0.4`
- System-parameter: altijd op het hoogste niveau van het API-verzoek, NOOIT in de messages-array
- Antwoord uitlezen via: `data.content[0].text`
- Verplichte headers: `anthropic-dangerous-direct-browser-access: true` en `anthropic-version: 2023-06-01`

### Kostenwaarschuwing

Er is geen dagelijks limiet op het aantal API-aanroepen. Wanneer het totale aantal API-aanroepen in de browseropslag de grens van 50 bereikt, toont de cursus eenmalig de volgende melding bovenaan het scherm, in een neutraal informatiekader:

> "Je hebt inmiddels 50 vragen aan AI gesteld in deze cursus. Tot nu toe heb je naar schatting €0,08 aan API-krediet gebruikt. Dat valt ruimschoots binnen het startkrediet van je account. Je kunt gewoon doorgaan."

Deze melding verschijnt maar één keer en verdwijnt na sluiten. De teller blijft doorlopen maar er is geen blokkade.

### Voortgangsopslag

Alle voortgang, ingevulde antwoorden, voltooide modules en de afsluitvraag uit module 1 worden opgeslagen in `localStorage` van de browser van de deelnemer. Bij het volledig wissen van browserdata begint de cursus opnieuw. De deelnemer wordt hierover geïnformeerd via een kleine rustige mededeling onderaan de navigatie: "Je voortgang wordt bewaard in deze browser. Wis je je browsergegevens, dan begint de cursus opnieuw."

### Feedbackpatroon (standaard voor alle opdrachten)

Tenzij anders beschreven, geldt voor elke opdracht met AI-feedback het volgende patroon:

1. De deelnemer ziet een opdrachttekst en een tekstveld.
2. Als het tekstveld leeg is en de deelnemer op versturen klikt, verschijnt de melding: "Vul eerst je antwoord in." Er wordt geen API-aanroep gedaan.
3. Na versturen verschijnt de laadtekst: "AI leest je antwoord..."
4. De AI-feedback verschijnt in een rustiek kader.
5. Onderaan de feedback staat altijd, in kleine grijze tekst: "Dit is feedback van een AI. Gebruik je eigen oordeel, AI kan zich vergissen."
6. Daarna verschijnt een inklapknop "Bekijk een voorbeeldantwoord" die pas na het versturen beschikbaar is.
7. Daarna een knop "Pas mijn antwoord aan en probeer opnieuw" die het tekstveld herlaadt met het eerder ingevulde antwoord.
8. Daarna een knop "Markeer als afgerond" waarmee de les wordt afgesloten.

### Kennischeckpatroon (standaard voor alle kennischecks)

1. Vraag met twee tot vier keuzemogelijkheden.
2. Bij een juist antwoord: groen vinkje, de juiste optie gemarkeerd in groen, en de uitlegzin eronder.
3. Bij een fout antwoord: de gekozen optie gemarkeerd in oranje, het juiste antwoord gemarkeerd in groen, en de uitlegzin eronder. Geen "probeer opnieuw" als blokkade. De deelnemer ziet de correctie en kan direct doorgaan.

---

## Module 0: Welkom en aan de slag

**Duur:** 20 minuten  
**Doel:** De deelnemer verwelkomen, de cursus uitleggen, en de AI-sleutel koppelen zodat alle latere modules werken.  
**Kolb-fase:** Ervaren (het eerste AI-contact als succesmoment)

### Scherm 0.1 — Welkomstscherm

**Wat de deelnemer ziet:**

Een warm welkomstscherm met de volgende elementen:

- Grote koptitel: "Welkom bij Werken met AI"
- Ondertitel: "Praktische e-learning voor medewerkers en vrijwilligers"
- Drie korte alinea's:
  - Alinea 1: "In deze cursus leer je AI gebruiken in je dagelijkse werk. Niet als technisch experiment, maar als praktisch hulpmiddel voor de taken die je toch al doet."
  - Alinea 2: "Je doorloopt zes modules. In elke module doe je iets, kijk je terug op wat je deed, en ga je met dat inzicht aan de slag. Je hoeft de cursus nooit te verlaten om te oefenen, alles gebeurt hier."
  - Alinea 3: "In deze cursus gaan we actief werken met AI. Daarvoor moeten we eerst een AI aan de training koppelen. Geen paniek! Het moeilijkste wat je hoeft te doen is een nieuw account aanmaken, en je wordt door alle stappen heen geloodst."
- Een overzichtsrij met de zes modules als kleine kaartjes, elk met het modulenummer, de naam en de duur.
- Een grote knop: "Aan de slag"

### Scherm 0.2 — AI-sleutel koppelen

**Wat de deelnemer ziet:**

Een scherm met de titel "Koppel je AI-sleutel" en de volgende vijf genummerde stappen:

1. Ga naar console.anthropic.com — maak hiervan een knop die in een nieuw tabblad opent
2. Maak een gratis account aan. Je hebt geen creditcard nodig voor het startkrediet
3. Ga in het menu naar "API Keys"
4. Klik op "Create Key", geef hem een naam, en kopieer de sleutel. Let op: je ziet de sleutel maar één keer
5. Plak je sleutel in het veld hieronder en klik op "Verbind AI"

Onder de stappen staat een invoerveld met plaatshouder "sk-ant-..." en een knop "Verbind AI".

Onderaan staat de volgende geruststelling in een rustig kader: "Je sleutel wordt alleen opgeslagen in jouw eigen browser en nergens anders naartoe gestuurd. Alleen jij hebt er toegang toe."

**Foutafhandeling:**

- Als het veld leeg is en de deelnemer op "Verbind AI" klikt: "Vul eerst je sleutel in bij stap 5."
- Als de sleutel al gekoppeld is, toont het scherm: "Je AI is gekoppeld" met twee knoppen: "Sleutel wijzigen" en "Sleutel verwijderen."

### Scherm 0.3 — Succesmoment

**Wat de deelnemer ziet:**

Zodra de sleutel succesvol is gekoppeld, verschijnt een groen kader: "Gelukt! Je hebt AI aan je cursus toegevoegd."

**[AI-AANROEP]**

Na de succesboodschap wordt automatisch `stuurVerzoek` aangeroepen met de volgende parameters:

`[SYSTEM-PROMPT]`  
Je bent een enthousiaste en warme leercoach voor een cursus over AI voor medewerkers en vrijwilligers in de sociale sector. Je spreekt de deelnemer aan met "je". Je reageert altijd in het Nederlands. Houd je reactie kort: maximaal vier zinnen. Wees oprecht en persoonlijk, geen sjabloonzinnen.

Bericht aan de AI: "Ik heb zojuist mijn AI-sleutel gekoppeld aan de cursus Werken met AI. Dit is mijn eerste stap. Reageer met een kort welkomstbericht en een oprecht compliment over wat ik zojuist heb bereikt."

Tijdens het wachten verschijnt: "AI bereidt je welkomstbericht voor..."

Het AI-antwoord verschijnt in een mooi kader. Daarna: een knop "Start module 1".

Bij een fout: toon de standaard foutmelding en een knop "Probeer opnieuw."

---

## Module 1: Wat is AI eigenlijk?

**Duur:** 35 minuten  
**Doel:** De deelnemer ervaart met eigen handen wat AI kan, begrijpt het basisprincipe, ziet het grootste risico, en leert het in eigen woorden uitleggen.  
**Kolb-cyclus:** Ervaren (les 1) → Begrijpen (les 2 en 3) → Toepassen en reflecteren (les 4)

---

### Les 1/4 — Het wow-moment

**Werkvorm:** Ervaren  
**Duur:** ±10 minuten  
**Kolb-fase:** Ervaren

**Doel van deze les:** De deelnemer maakt met eigen handen iets dat hij zonder AI nooit zo snel had kunnen maken. Het gevoel van "dit deed ik zelf" is essentieel: de deelnemer moet op de knop drukken, niet een voorbeeld bekijken.

---

**Onderdeel 1.1.A — Tijdsvergelijking**

Het scherm opent met een tweedelige lay-out. Links staat een stappenlijst met de koptekst "Zonder AI" en een tijdsindicatie van "±45 minuten" in rode tekst erboven. De stappenlijst bevat de volgende punten:

1. Open Word en bedenk hoe je begint
2. Schrijf een eerste versie van de uitnodigingstekst
3. Herlees, twijfel over de toon, pas aan
4. Hannisen met lay-out en opmaak om er iets moois van te maken
5. Vraag een collega om feedback
6. Verwerk de feedback en maak de definitieve versie

Rechts staat een vlak met de koptekst "Met AI" en een tijdsindicatie van "±10 seconden" in groene tekst erboven. In het vlak staat de tekst: "Hier verschijnt jouw flyer." Het vlak heeft een lichte groene achtergrondkleur en een subtiele rand.

---

**Onderdeel 1.1.B — Aanpasbare prompt**

Onder de tweedelige lay-out staat een kleine instructietekst: "Hieronder staat de vraag die we aan AI gaan stellen. Je mag hem aanpassen of zo laten. Verander bijvoorbeeld de datum, de locatie of de toon. Klik daarna op de knop."

Hieronder staat een tekstveld dat de deelnemer kan bewerken, vooraf ingevuld met de volgende prompt:

> Maak een mooie HTML-uitnodigingsflyer voor een gratis inloopmiddag voor mensen met geldzorgen. De middag is op 15 april, van 13:00 tot 15:30, in het wijkcentrum. Aanwezig zijn een schuldhulpverlener en een medewerker van de gemeente. De sfeer moet warm en laagdrempelig zijn. Gebruik kleuren die rustig en uitnodigend zijn. Voeg toe: een duidelijke koptitel, de datum en het tijdstip, een korte uitnodigende tekst van twee zinnen, en onderaan de locatienaam. Het resultaat moet er als een echte flyer uitzien met opmaak, kleur en typografie, niet als platte tekst.

---

**Onderdeel 1.1.C — De genereerknop**

**[AI-AANROEP]**

Een grote, opvallende knop: "Maak mijn flyer →"

`[SYSTEM-PROMPT]`  
Je bent een expert in HTML en webdesign. Je maakt uitsluitend volledige, zelfstandige HTML-bestanden die er professioneel uitzien als grafische flyers. Gebruik inline CSS voor alle opmaak. Gebruik rustige, warme kleuren. Gebruik een duidelijke typografische hiërarchie met een grote koptitel, datum, tekst en locatie. Voeg geen uitleg toe, geen codeblokken, geen markdown. Geef alleen de volledige HTML-code, beginnend met `<!DOCTYPE html>`.

Het bericht aan de AI bestaat uit de inhoud van het tekstveld zoals de deelnemer het heeft gelaten of aangepast.

Tijdens het wachten verschijnt in het rechterdeelvenster: "AI is je flyer aan het maken..." met een subtiele laadanimatie.

Het API-antwoord (`data.content[0].text`) bevat de volledige HTML. Die HTML wordt weergegeven als een iframe in het rechterdeelvenster, zodat de deelnemer een visuele flyer ziet en geen code.

Boven het iframe verschijnt een kleine stopwatch die aangeeft hoelang het heeft geduurd: "Jouw flyer was klaar in [X] seconden." Direct naast de stopwatch staat een kopieerknop: "Kopieer HTML-code."

---

**Onderdeel 1.1.D — Open reflectievraag**

Na het verschijnen van de flyer verschijnt onder het scherm de volgende vraag: "Wat valt je op? Wat zou jij zelf nog aanpassen aan de flyer of aan de vraag die je stelde?"

Er is een kort tekstveld. Het antwoord wordt opgeslagen in `localStorage` maar niet beoordeeld en niet naar de AI gestuurd. Er is een knop "Doorgaan" die het volgende onderdeel opent.

---

**Onderdeel 1.1.E — Herkenningskaartjes**

Zes kaartjes verschijnen in een raster. Elk kaartje bevat één taakomschrijving. De deelnemer klikt aan welke taken hij zelf doet. Er is geen goed of fout, geen minimumeis, en de selectie telt niet mee voor de voortgang.

De zes kaartjes:

1. "Uitnodigingen en aankondigingen schrijven voor activiteiten"
2. "E-mails lezen en de actiepunten eruit halen"
3. "Draaiboeken en planningen maken voor evenementen"
4. "Verslagen schrijven na vergaderingen of bijeenkomsten"
5. "Subsidieaanvragen en beleidsteksten formuleren"
6. "Flyers en communicatieteksten maken zonder grafisch ontwerper"

Na het aanklikken en doorklikken verschijnt de tekst: "Goed om te weten. In de volgende modules oefenen we precies met dit soort taken."

Knop: "Naar les 2"

---

### Les 2/4 — Hoe werkt AI?

**Werkvorm:** Begrijpen  
**Duur:** ±8 minuten  
**Kolb-fase:** Begrijpen

**Doel van deze les:** De deelnemer begrijpt het basisprincipe van AI op een manier die bijblijft: niet als technische uitleg, maar als een logische kapstok voor alles wat volgt.

---

**Onderdeel 1.2.A — De belezen collega-analogie**

Een compact tekstblok in een rustig kader met een groene linkerlijn (stijlgids: `border-left: 3px solid #6b8068; padding-left: 14px`), in Fraunces italic. De tekst luidt:

> Stel je voor dat iemand alle boeken, artikelen en websites ter wereld heeft gelezen. Als jij een zin begint, voorspelt diegene razendsnel wat er daarna het meest logisch staat. Niet omdat hij het begrijpt, maar omdat hij ontelbare keren heeft gezien hoe tekst loopt.
>
> Dat is AI. Het voorspelt het meest waarschijnlijke volgende woord, op basis van alles wat het heeft 'gelezen'. Het begrijpt niets. Het herkent patronen.

---

**Onderdeel 1.2.B — Twee eigenschappenkaarten**

Twee kaarten naast elkaar in een raster. De kaarten zijn even groot.

Kaart links, koptekst "Wat AI goed kan":
- Snel: dezelfde taak in seconden, niet in uren
- Consistent: altijd even geduldige en zorgvuldige output
- Onvermoeibaar: geen chagrijn bij de tiende herhaling
- Nooit beschaamd door een 'domme' vraag

Kaart rechts, koptekst "Wat AI niet kan":
- Begrijpen wat het schrijft
- Oordelen of iets klopt of juist is
- Zelf controleren of informatie correct is
- Eigen ervaringen of gevoelens hebben

De linkerkaart heeft een lichte groene achtergrondkleur. De rechterkaart heeft een lichte oranje achtergrondkleur. Beide kleuren zijn gedempt, passend bij de stijlgids.

---

**Onderdeel 1.2.C — Kennischeck**

Vraag: "Wat doet AI als jij een vraag stelt?"

Vier opties:
- A. Het denkt na en begrijpt je vraag
- B. Het zoekt het antwoord op het internet
- C. Het voorspelt het meest waarschijnlijke antwoord op basis van patronen in tekst
- D. Het herhaalt wat het eerder al heeft gezegd

Juist antwoord: C

Uitlegzin bij het juiste antwoord: "AI heeft enorm veel tekst verwerkt en kan op basis daarvan voorspellen wat een logisch antwoord is op jouw vraag. Het begrijpt je vraag niet, maar herkent patronen die op jouw situatie lijken."

---

### Les 3/4 — AI liegt geloofwaardig

**Werkvorm:** Begrijpen via confronterende ervaring  
**Duur:** ±10 minuten  
**Kolb-fase:** Ervaren en begrijpen gecombineerd

**Doel van deze les:** De deelnemer ervaart zelf hoe overtuigend een fout AI-antwoord eruitziet. Dit is de meest kritieke les van de module: een lijstje met waarschuwingen werkt niet, maar een persoonlijke confrontatie met het probleem wel.

---

**Onderdeel 1.3.A — De perfecte tekst met verborgen fouten**

De deelnemer ziet een inleidende zin: "AI-teksten zien er vaak foutloos uit. Lees de volgende tekst aandachtig."

Daarna verschijnt de volgende AI-gegenereerde tekst, professioneel opgemaakt, in een rustig kader:

---

*Bijzondere bijstand: wat u moet weten*

Bijzondere bijstand is een aanvulling op de reguliere bijstandsuitkering voor mensen met noodzakelijke kosten die zij niet uit eigen middelen kunnen betalen. Op grond van artikel 35 lid 2 van de Participatiewet heeft iedere inwoner recht op een individuele toets van zijn situatie.

De gemeente hanteert een inkomensgrens van 120 procent van de bijstandsnorm. Kosten die voor vergoeding in aanmerking komen zijn onder meer medische hulpmiddelen, schoolkosten voor kinderen en woonkosten bij calamiteiten. Een aanvraag wordt binnen acht weken behandeld en de uitkering wordt in één keer uitbetaald.

Schulden bij woningcorporaties worden in principe niet vergoed, tenzij het gaat om een dreigende huisuitzetting waarbij het gezinsbelang in het geding is. In dat geval kan de gemeente op basis van artikel 36a een noodfonds activeren tot een maximum van 2.500 euro.

---

Onder de tekst staat de instructie voor het volgende onderdeel.

**Noot voor Claude Code:** De drie fouten in deze tekst zijn: (1) "artikel 35 lid 2 van de Participatiewet" is een bestaand artikel maar heeft niet de strekking die hier wordt gesuggereerd, (2) de inkomensgrens van "120 procent" is een gangbaar getal maar varieert per gemeente en is hier als absolute regel gepresenteerd, (3) "artikel 36a" voor een noodfonds bestaat niet in de Participatiewet. Deze fouten zijn bewust aangebracht voor didactische doeleinden. De tekst is niet bedoeld als juridische informatie.

---

**Onderdeel 1.3.B — Markeer wat je zou vertrouwen**

Na de tekst verschijnt de instructie: "Klik op de zinnen die jij zonder extra controle zou gebruiken in je eigen werk."

De tekst wordt herklikbaar gepresenteerd per zin. Elke zin is klikbaar en kleurt lichtgeel wanneer de deelnemer hem aanklikt (geselecteerd). Een tweede klik maakt de selectie ongedaan.

Daarna verschijnt een knop: "Bekijk welke zinnen niet kloppen."

Na het klikken op deze knop: de drie foutieve zinnen lichten op in oranje. De geselecteerde zinnen van de deelnemer die fout waren, krijgen een aanvullende rode markering. De niet-foutieve zinnen die de deelnemer had geselecteerd krijgen een groene markering.

Onder elke gemarkeerde foutieve zin verschijnt een korte uitleg in een klein kader:

- Bij de zin over artikel 35 lid 2: "Dit wetsartikel bestaat, maar de strekking zoals hier beschreven is niet correct. Controleer altijd wetgeving via wetten.nl."
- Bij de zin over 120 procent: "Dit percentage varieert per gemeente. AI presenteert één getal alsof het universeel geldt."
- Bij de zin over artikel 36a: "Dit wetsartikel bestaat niet in de Participatiewet. AI heeft dit geconstrueerd op basis van het patroon van de omringende tekst."

Na de onthulling verschijnt de tekst: "AI klinkt altijd zeker. Dat is precies het gevaar."

---

**Onderdeel 1.3.C — Bewaarkaartje**

Een visuele kaart in de stijl van de stijlgids met de koptekst "Controleer altijd bij:" en vijf punten:

1. Wetten en officiële regels
2. Namen, functies en organisaties
3. Datums, bedragen en percentages
4. Juridische informatie
5. Medische informatie

Onderaan de kaart staat een downloadknop: "Download dit kaartje (PDF)" zodat de deelnemer het kan opslaan of printen.

---

**Onderdeel 1.3.D — Kennischeck**

Vraag: "AI vertelt jou welk wetsartikel van toepassing is op een aanvraag bijzondere bijstand. Wat doe je?"

Vier opties:
- A. Dat overnemen in de brief, want AI heeft heel veel wetgeving gelezen
- B. Het artikel opzoeken op wetten.nl of bij een betrouwbare bron voordat je het gebruikt
- C. Vragen aan een collega of het klopt
- D. Het artikel weglaten uit de brief om zeker te zijn

Juist antwoord: B

Uitlegzin: "AI kan wetsartikelen noemen die niet bestaan, verouderd zijn, of een verkeerde strekking hebben. De enige betrouwbare bron voor wetgeving is wetten.nl of een officiële instantie."

---

### Les 4/4 — Jouw eerste opdracht

**Werkvorm:** Toepassen en reflecteren  
**Duur:** ±8 minuten  
**Kolb-fase:** Toepassen en reflecteren

**Doel van deze les:** De Kolb-cyclus sluiten. Wie iets in eigen woorden kan uitleggen aan een buitenstaander, heeft het echt begrepen. De opdracht vraagt om een eigen analogie om reproduceren te voorkomen.

---

**Onderdeel 1.4.A — Schrijfopdracht**

Opdrachttekst: "Beschrijf in je eigen woorden aan iemand zonder AI-kennis wat AI is. Gebruik een eigen vergelijking. Niet de belezen-collega-analogie die je net hebt gelezen, maar iets wat bij jouw eigen werk of leven past. Schrijf minimaal drie zinnen."

Tekstveld: ruim, minimaal 120px hoog op mobiel.

**[AI-AANROEP]**

`[SYSTEM-PROMPT]`  
Je bent een vriendelijke leercoach voor een cursus over AI voor medewerkers en vrijwilligers in de sociale sector. Je beoordeelt de uitleg die een deelnemer heeft geschreven. Controleer drie dingen: (1) is de uitleg begrijpelijk voor iemand zonder AI-kennis, (2) zit het idee van voorspellen in plaats van begrijpen er impliciet of expliciet in, (3) is er een eigen analogie gebruikt die logisch klopt. Geef een oprecht compliment voor wat goed is. Benoem één concreet verbeterpunt als dat er is. Sluit aanmoedigend af. Maximaal 100 woorden. Schrijf in het Nederlands.

`[VOORBEELDANTWOORD]`  
"AI is een beetje als een heel ervaren tekstschrijver die duizenden brieven heeft gelezen. Als jij begint met 'Geachte mevrouw, ik schrijf u in verband met...', dan weet die schrijver op basis van alle eerdere brieven ongeveer hoe zo'n zin verder gaat. Niet omdat hij jouw situatie begrijpt, maar omdat hij het patroon herkent. Dat is handig voor standaardteksten, maar je moet altijd zelf controleren of de inhoud ook echt klopt voor jouw specifieke situatie."

---

**Onderdeel 1.4.B — Afsluitvraag**

Na de feedback verschijnt de volgende vraag: "Welke taak uit jouw eigen werk zou jij als eerste met AI willen uitproberen?"

Tekstveld: vrij in te vullen. Het antwoord wordt opgeslagen in `localStorage` onder de sleutel `module1_eigen_taak`. Dit antwoord wordt later teruggetoond aan het begin van module 4.

Knop: "Bewaar mijn antwoord en sluit module 1 af"

**Afsluittekst van module 1:** "Module 1 voltooid. Je begrijpt nu hoe AI werkt, waarom je het kritisch moet gebruiken, en hoe je het kunt uitleggen aan iemand anders. Module 1 wordt gemarkeerd als voltooid."

---

## Module 2: Veilig gebruik

**Duur:** 30 minuten  
**Doel:** De deelnemer leert hoe hij AI veilig inzet voor de mensen die hij helpt, vanuit het perspectief van bescherming, niet van verbod.  
**Toon:** Respectvol en empowerend. Het gaat over het beschermen van kwetsbare mensen, niet over wat er allemaal niet mag.  
**Kolb-cyclus:** Ervaren (les 1, het dilemma) → Begrijpen (les 2, de gouden regel) → Toepassen (les 3, anonimiseren)

---

### Les 1/3 — Het dilemma

**Werkvorm:** Ervaren via herkenning  
**Duur:** ±8 minuten  
**Kolb-fase:** Ervaren

**Doel:** De deelnemer herkent zichzelf in een realistisch dilemma voordat er iets wordt uitgelegd. Herkenning opent mensen voor de uitleg die volgt.

---

**Onderdeel 2.1.A — De situatieschets**

Een korte scène in een rustig kader:

> Fatima is vrijwilliger bij een welzijnsorganisatie. Ze wil een brief schrijven voor een cliënt, mevrouw Bakker, die drie maanden huurachterstand heeft van 1.240 euro. Fatima heeft tijdgebrek. Ze denkt: "Ik typ de situatie snel in bij AI, dan heb ik in een minuut een goede brief." Ze opent het chatvenster en begint te typen: "Schrijf een brief voor mevrouw Bakker, Westerstraat 4, die 1.240 euro huurschuld heeft..."

Onder de scène staat de vraag: "Wat is het risico van wat Fatima doet?"

---

**Onderdeel 2.1.B — Kennischeck**

Vraag: "Wat is het risico als Fatima de naam en het schuldbedrag van mevrouw Bakker invoert in AI?"

Vier opties:
- A. AI kan de brief niet schrijven als er persoonsnamen in staan
- B. De gegevens van mevrouw Bakker kunnen worden opgeslagen door de AI-aanbieder en zijn dan buiten de controle van de organisatie
- C. De brief wordt dan niet persoonlijk genoeg
- D. Er is geen risico, AI is een veilig gesloten systeem

Juist antwoord: B

Uitlegzin: "AI-diensten verwerken de tekst die je instuurt op hun servers. Afhankelijk van de instellingen kunnen die gegevens worden gebruikt om het model te verbeteren. Persoonsgegevens van cliënten horen niet buiten de organisatie te gaan, ook niet via een AI-chatvenster."

---

**Onderdeel 2.1.C — Overbrugging naar les 2**

Tekst: "Het goede nieuws: Fatima kan AI nog steeds gebruiken voor deze brief. Ze hoeft er alleen één stap aan toe te voegen. Dat leer je in de volgende les."

Knop: "Naar les 2"

---

### Les 2/3 — De gouden regel

**Werkvorm:** Begrijpen  
**Duur:** ±10 minuten  
**Kolb-fase:** Begrijpen

**Doel:** De deelnemer leert de gouden regel voor veilig AI-gebruik en begrijpt de logica erachter, zodat hij hem zelf kan toepassen in situaties die nog niet in de cursus zijn behandeld.

---

**Onderdeel 2.2.A — De gouden regel**

Een grote, prominente weergave van de kernregel, in het centrum van het scherm:

> "Wat je niet op een reclamebord wilt zien, geef je niet aan AI."

Daarna een korte uitleg in twee alinea's:

"Als je niet wilt dat een tekst publiekelijk zichtbaar is, zijn de gegevens daarin ook niet bedoeld voor externe verwerking. AI is een externe dienst. Behandel het invoerveld als een brief die je opstuurt naar een onbekende partij.

De oplossing is simpel: anonimiseer eerst. Beschrijf de situatie zonder namen, adressen, bedragen of andere herleidbare gegevens. Het resultaat is net zo bruikbaar."

---

**Onderdeel 2.2.B — Twee-kolommenkaart**

Twee kolommen naast elkaar:

Linkerkolom, koptekst "Nooit invoeren in AI":
- Namen van cliënten of deelnemers
- Adressen en contactgegevens
- Financiële situaties van gezinnen of personen
- Medische of psychologische informatie
- BSN-nummers of andere identificerende gegevens

Rechterkolom, koptekst "Veilig gebruiken met AI":
- Anonieme situatiebeschrijvingen ("een cliënt met huurachterstand")
- Subsidieteksten zonder namen
- Communicatietemplates en uitnodigingsteksten
- Draaiboeken en planningen voor activiteiten
- Verslagen zonder persoonsgegevens

---

**Onderdeel 2.2.C — Kennischeck**

Vraag: "Je wilt AI helpen een brief te schrijven voor een cliënt met schulden. Wat geef je in?"

Vier opties:
- A. De volledige naam, het adres en het exacte schuldbedrag, zodat de brief zo persoonlijk mogelijk is
- B. Alleen de naam, niet het adres
- C. Een anonieme beschrijving: "een cliënt met huurachterstand van enkele honderden euro's"
- D. Niets: voor brieven over schulden gebruik je AI beter niet

Juist antwoord: C

Uitlegzin: "AI heeft de persoonsgegevens niet nodig om een goede brief te schrijven. Een anonieme situatiebeschrijving geeft genoeg context voor een bruikbaar resultaat. Jij vult daarna de juiste naam en het bedrag zelf in."

---

### Les 3/3 — Oefen zelf

**Werkvorm:** Toepassen  
**Duur:** ±12 minuten  
**Kolb-fase:** Toepassen

**Doel:** De deelnemer oefent zelf het anonimiseren, het vaardigheidsdeel dat het meest wordt vergeten na de cursus.

---

**Onderdeel 2.3.A — De opdracht**

Opdrachttekst:

"Hieronder staat een situatie met persoonsgegevens, zoals Fatima die ook had kunnen intypen. Herschrijf hem zo dat je hem veilig aan AI kunt geven. Verwijder alle herleidbare informatie, maar zorg dat de situatie nog bruikbaar is voor het schrijven van een brief.

**De originele situatie:**
Schrijf een brief aan mevrouw De Vries, Hoofdstraat 12 in Almere, die al vier maanden haar huur niet betaalt en een achterstand heeft opgebouwd van 1.240 euro. Ze heeft drie kinderen en ontvangt een bijstandsuitkering.

Schrijf jouw anonieme versie in het veld hieronder."

**[AI-AANROEP]**

`[SYSTEM-PROMPT]`  
Je bent een coach voor medewerkers en vrijwilligers in de sociale sector die leren veilig met AI te werken. Je beoordeelt een anonieme herschrijving. Controleer drie dingen: (1) zijn alle persoonsgegevens verwijderd (naam, adres, exacte bedragen die herleidbaar zijn), (2) is de essentie van de situatie nog bruikbaar voor het schrijven van een brief, (3) is de herschrijving duidelijk genoeg. Geef een concreet compliment als iets goed is gedaan. Wijs op wat eventueel nog te specifiek is. Maximaal 80 woorden. Schrijf in het Nederlands.

`[VOORBEELDANTWOORD]`  
"Schrijf een brief voor een cliënte die al enkele maanden haar huur niet betaalt en een aanzienlijke achterstand heeft opgebouwd. Ze heeft een gezin met kinderen en ontvangt een uitkering. De brief moet vriendelijk maar duidelijk zijn over de ernst van de situatie en de mogelijke vervolgstappen."

**Afsluittekst van module 2:** "Module 2 voltooid. Je weet nu hoe je AI veilig inzet voor de mensen die jij helpt."

---

## Module 3: Goede prompts schrijven

**Duur:** 40 minuten  
**Doel:** De deelnemer leert prompts schrijven die betrouwbaar goede resultaten geven, met behulp van de drie elementen ROL, TAAK en CONTEXT.  
**Kolb-cyclus:** Ervaren (les 1, de demo) → Begrijpen (les 2, de drie elementen) → Toepassen (les 3, verbeteren) → Toepassen en reflecteren (les 4, eigen werk)

---

### Les 1/4 — Ervaar het verschil

**Werkvorm:** Ervaren via interactieve demo  
**Duur:** ±8 minuten  
**Kolb-fase:** Ervaren

**Doel:** Het verschil tussen een slechte en een goede prompt zichtbaar maken via vaste voorbeeldteksten, zonder echte AI-aanroep. Vaste teksten garanderen dat iedereen hetzelfde leerzame contrast ziet.

---

**Onderdeel 3.1.A — De prompt-demo**

De demo heeft twee standen. Er is een toggle-knop om te wisselen.

**Stand 1 — Slechte prompt (standaard bij openen):**

In een rood kader boven de demo: "Vaag in = vaag uit"

Prompt (weergegeven als invoer in een gestileerd chatvenster): "Schrijf iets over onze activiteit."

Reactie van AI (weergegeven als antwoord in hetzelfde chatvenster):

> Beste deelnemers,
>
> Binnenkort organiseren wij een interessante activiteit. Er zullen diverse mogelijkheden zijn om elkaar te ontmoeten en informatie te krijgen. We hopen u te verwelkomen op dit evenement.
>
> Met vriendelijke groet,
> Het organisatieteam

Onder de reactie staat in rode tekst: "Generiek, geen datums, geen toon, niet voor jouw doelgroep."

**Stand 2 — Goede prompt:**

In een groen kader boven de demo: "Specifiek in = bruikbaar uit"

Prompt: "Je bent een vriendelijke communicatiemedewerker bij een wijkorganisatie. Schrijf een uitnodigingstekst van maximaal 80 woorden voor een gratis inloopmiddag op 15 april van 13:00 tot 15:30 in het wijkcentrum. De middag is voor mensen met geldzorgen. Toon: warm en laagdrempelig. Geen ambtelijk taalgebruik."

Reactie van AI:

> Heb je zorgen over geld? Je bent niet alleen, en er is hulp.
>
> Op 15 april van 13:00 tot 15:30 verwelkomen we je in het wijkcentrum voor een gratis inloopmiddag. Er zijn mensen van de gemeente en een schuldhulpverlener aanwezig die je vrijblijvend te woord staan. Kom gewoon langs, aanmelden is niet nodig.

Onder de reactie staat in groene tekst: "Direct bruikbaar. Juiste toon, juiste doelgroep, juiste lengte."

---

**Onderdeel 3.1.B — Reflectievraag**

Onder de demo staat de vraag: "Welk van de drie elementen ROL, TAAK en CONTEXT ontbreekt in de slechte prompt?"

Drie keuzes:
- A. Alleen ROL
- B. Alleen TAAK
- C. Alle drie: ROL, TAAK én CONTEXT

Juist antwoord: C

Uitlegzin: "In de slechte prompt ontbreekt de ROL (wie moet AI zijn), de TAAK (wat precies, voor wie, welk format) en de CONTEXT (doelgroep, toon, datum). De volgende les legt uit wat elk element betekent."

---

### Les 2/4 — De drie elementen

**Werkvorm:** Begrijpen  
**Duur:** ±8 minuten  
**Kolb-fase:** Begrijpen

**Doel:** De drie elementen van een goede prompt uitleggen met heldere definities en directe voorbeelden uit de eigen werkomgeving van de doelgroep.

---

**Onderdeel 3.2.A — Drie uitlegkaarten**

Drie kaarten onder elkaar, elk met een nummer, naam en uitleg:

**Kaart 1 — ROL**

"Vertel AI wie hij moet zijn. AI past zijn woordkeuze, toon en niveau aan op de rol die jij geeft. Zonder rol spreekt AI als een anonieme assistent: correct maar generiek.

Voorbeeld: 'Je bent een vriendelijke communicatiemedewerker bij een wijkorganisatie.'"

**Kaart 2 — TAAK**

"Beschrijf wat je wilt: het formaat, de lengte, het doel. Hoe specifieker je bent, hoe bruikbaarder het resultaat.

Voorbeeld: 'Schrijf een uitnodigingstekst van maximaal 80 woorden voor een gratis inloopmiddag.'"

**Kaart 3 — CONTEXT**

"Geef de informatie die AI nodig heeft: voor wie is het, wanneer, welke toon past, wat zijn de bijzonderheden?

Voorbeeld: 'De middag is voor mensen met geldzorgen, op 15 april van 13:00 tot 15:30, in het wijkcentrum. Toon: warm en laagdrempelig.'"

---

**Onderdeel 3.2.B — Kennischeck**

Vraag: "Welke elementen ontbreken in deze prompt: 'Je bent een communicatiemedewerker bij een welzijnsorganisatie. Schrijf iets voor de bewoners over de inloopmiddag.'"

Vier opties:
- A. Alleen TAAK ontbreekt: er is geen format, lengte of doel opgegeven
- B. Alleen CONTEXT ontbreekt: er is geen datum, doelgroep of toon meegegeven
- C. ROL én CONTEXT ontbreken: er is geen beschrijving van wie AI moet zijn en er is geen doelgroep of toon
- D. ROL, TAAK én CONTEXT ontbreken alle drie

Juist antwoord: A

Uitlegzin: "Deze prompt heeft wel een ROL (communicatiemedewerker bij een welzijnsorganisatie) en CONTEXT (bewoners, inloopmiddag). Maar de TAAK ontbreekt: wat voor tekst, hoe lang, in welk format, met welk doel? Zonder die specificaties kiest AI zelf en is het resultaat een gok."

---

**Onderdeel 3.2.C — Vijf bonustechnieken**

Een compacte lijst als aanvulling, in een licht kader:

"Vijf technieken die direct werken:

1. **Geef een voorbeeld** — 'Net als deze tekst: [plak voorbeeld]'
2. **Zeg wat je niet wilt** — 'Geen jargon', 'niet formeel', 'zonder opsomming'
3. **Vraag meerdere versies** — 'Geef me drie varianten'
4. **Bouw voort** — 'Maak dit korter', 'schrijf het vriendelijker'
5. **Vraag door** — 'Waarom kies je voor deze aanpak?'"

---

### Les 3/4 — Verbeter een slechte prompt

**Werkvorm:** Toepassen  
**Duur:** ±12 minuten  
**Kolb-fase:** Toepassen

**Doel:** De deelnemer verbetert zelf een prompt door de drie elementen toe te voegen. Dit is de eerste keer dat hij zelf een prompt schrijft met het geleerde kader.

---

**Onderdeel 3.3.A — De opdracht**

Opdrachttekst: "Hieronder staat een slechte prompt. Verbeter hem door ROL, TAAK en CONTEXT toe te voegen. Je hoeft de verbeterde prompt niet echt naar AI te sturen. Schrijf hem in het veld hieronder.

**De slechte prompt:**
'Schrijf iets voor onze nieuwsbrief.'"

**[AI-AANROEP]**

`[SYSTEM-PROMPT]`  
Je bent een promptcoach voor medewerkers en vrijwilligers in de sociale sector. Je beoordeelt een verbeterde prompt. Controleer drie dingen: (1) is er een ROL aanwezig, (2) is de TAAK concreet omschreven, (3) is er CONTEXT gegeven over de doelgroep en/of het onderwerp. Benoem per element kort of het aanwezig is. Complimenteer wat goed is. Geef aan wat er eventueel nog mist. Maximaal 100 woorden. Schrijf in het Nederlands.

`[VOORBEELDANTWOORD]`  
"Je bent een communicatiemedewerker bij een welzijnsorganisatie. Schrijf een nieuwsbrieftekst van maximaal 100 woorden over onze gratis inloopmiddag voor mensen met geldzorgen op 15 april. Doelgroep: bewoners van de wijk die weinig lezen. Toon: warm, eenvoudig taalgebruik, geen jargon. Vermeld de datum, het tijdstip en dat aanmelden niet nodig is."

---

### Les 4/4 — Schrijf een prompt voor je eigen werk

**Werkvorm:** Toepassen en reflecteren  
**Duur:** ±12 minuten  
**Kolb-fase:** Toepassen en reflecteren

**Doel:** De deelnemer verbindt het geleerde aan zijn eigen werkpraktijk. Dit is de meest persoonlijke opdracht van de module.

---

**Onderdeel 3.4.A — De opdracht**

Opdrachttekst: "Kies een taak die jij regelmatig doet in je werk of als vrijwilliger. Schrijf daarvoor een prompt met ROL, TAAK en CONTEXT. Het hoeft niet perfect te zijn. Het doel is dat jij een prompt schrijft die je na deze cursus echt kunt gebruiken."

**[AI-AANROEP]**

`[SYSTEM-PROMPT]`  
Je bent een vriendelijke promptcoach voor medewerkers en vrijwilligers in de sociale sector. Je beoordeelt een zelfgeschreven prompt. Controleer: (1) is ROL aanwezig, (2) is TAAK concreet, (3) is CONTEXT gegeven. Beoordeel ook of de taak geschikt is voor AI. Als de taak persoonsgegevens bevat, wijs hier dan vriendelijk op en stel een anonieme versie voor. Als alle drie elementen aanwezig zijn, bevestig dat de prompt klaar voor gebruik is. Sluit aanmoedigend af. Maximaal 120 woorden. Schrijf in het Nederlands.

`[VOORBEELDANTWOORD]`  
"Je bent een ervaren notulist bij een welzijnsorganisatie. Vat de volgende vergadernotities samen in maximaal 150 woorden. Vermeld per agendapunt het besluit en de actiepunten met naam en deadline. Laat algemene discussie weg. Toon: zakelijk en bondig. Doelgroep: teamleden die de vergadering hebben gemist."

**Afsluittekst van module 3:** "Module 3 voltooid. Je schrijft nu prompts die echt werken."

---

## Module 4: De drie oefeningen

**Duur:** 50 minuten  
**Doel:** De deelnemer werkt in de echte AI-tool aan drie oefeningen die op elkaar voortbouwen. De cursus geeft feedback op de aanpak, de externe tool levert het werkelijke resultaat.  
**Werkomgeving:** De deelnemer werkt in claude.ai of chatgpt.com en brengt zijn prompt plus de eerste regels van het resultaat terug in de cursus.  
**Doorlopende casus:** Het organiseren van een inloopmiddag voor mensen met geldzorgen.

---

**Introductie van module 4**

Boven aan module 4 verschijnt het eerder opgeslagen antwoord van de deelnemer uit module 1, les 4, in een lichtgekleurd kader:

> "In module 1 schreef jij: [[module1_eigen_taak]]
>
> Houd dat in gedachten terwijl je de oefeningen hieronder maakt. Na de drie casus-oefeningen is er ruimte om ook jouw eigen taak te oefenen."

Als de deelnemer geen antwoord heeft opgeslagen in module 1, wordt dit kader niet getoond.

---

**Onderdeel 4.0 — De rode draad**

Een uitlegscherm, geen opdracht:

"In de komende drie oefeningen organiseer jij een inloopmiddag voor mensen met geldzorgen. Je werkt daarvoor in de echte AI-tool die je na deze cursus ook in je dagelijkse werk zult gebruiken: claude.ai of chatgpt.com. Beide zijn gratis toegankelijk.

De werkwijze in elke oefening is hetzelfde:

1. Lees de informatie die je krijgt
2. Schrijf een prompt met ROL, TAAK en CONTEXT
3. Open claude.ai of chatgpt.com in een nieuw tabblad
4. Voer je prompt in, plus de bijgeleverde informatie
5. Kopieer je prompt en de eerste vijf regels van het resultaat terug in het veld hieronder

De cursus geeft je daarna feedback op je aanpak, niet op het AI-resultaat zelf. Want dat resultaat is ook afhankelijk van hoe goed jij de vraag hebt gesteld."

Knop: "Begin met oefening 1"

---

**Instructieblok (wordt getoond boven élke opdracht in module 4):**

> Open claude.ai of chatgpt.com in een nieuw tabblad. Gebruik de informatie hierboven als onderdeel van je prompt. Voer de opdracht uit. Kopieer daarna je prompt en de eerste vijf regels van het resultaat terug in het veld hieronder.

---

### Les 1/4 — Van ruw plan naar draaiboek

**Duur:** ±15 minuten

**Onderdeel 4.1.A — De informatie**

De deelnemer ziet het volgende ruwe plan:

> **Ruw plan: inloopmiddag mensen met geldzorgen**
>
> - Gratis, laagdrempelig, ergens in april
> - Informatietafel gemeente over toeslagen en regelingen
> - Schuldhulpverlener aanwezig voor gesprekken
> - Koffie, thee, misschien wat te eten
> - Activiteit voor kinderen zodat ouders rustig kunnen praten
> - Aanmelden niet verplicht maar handig voor de catering
> - Flyer ophangen bij voedselbank en wijkcentrum
> - Gewenst eindproduct: draaiboek met tijdsblokken, taakverdeling en checklist

---

**Onderdeel 4.1.B — De opdracht**

"Schrijf een prompt met ROL, TAAK en CONTEXT om van dit ruwe plan een gestructureerd draaiboek te laten maken. Gebruik het instructieblok hierboven. Plak je prompt en de eerste vijf regels van het resultaat terug."

**[AI-AANROEP]**

`[SYSTEM-PROMPT]`  
Je bent een coach voor vrijwilligers en medewerkers in de sociale sector die leren werken met AI-prompts. Je beoordeelt of de ingediende prompt ROL, TAAK en CONTEXT bevat en of het resultaat erop lijkt te wijzen dat de prompt goed heeft gewerkt. Controleer ook of de deelnemer een maximale lengte heeft opgegeven voor het draaiboek. Als dat ontbreekt, wijs er dan vriendelijk op dat een lengte-instructie helpt om een beknopt en bruikbaar resultaat te krijgen. Maximaal 150 woorden. Schrijf in het Nederlands.

`[VOORBEELDANTWOORD]`  
"Je bent een ervaren eventcoördinator bij een wijkorganisatie. Maak een gestructureerd draaiboek voor een gratis inloopmiddag voor mensen met geldzorgen. Gebruik de volgende ruwe informatie: [plak het ruwe plan hierboven]. Het draaiboek bevat: tijdsblokken van 30 minuten, een taakverdeling per verantwoordelijke, en een afvinklijst van wat er geregeld moet worden. Maximaal twee pagina's A4. Toon: praktisch en overzichtelijk."

Noot voor Claude Code: de zinsnede "maximaal twee pagina's A4" is essentieel. Zonder lengte-instructie maakt AI een uitgebreid document dat de oefening onnodig complex maakt en meer tokens kost dan nodig is. Neem deze instructie ook op in de opdrachttekst die de deelnemer ziet.

---

### Les 2/4 — Actiepunten uit een mail halen

**Duur:** ±12 minuten

**Onderdeel 4.2.A — De mail van Marieke**

De deelnemer ziet de volgende mail:

> **Van:** Marieke  
> **Onderwerp:** Update inloopmiddag
>
> Hoi,
>
> Ik zat net alles op een rijtje te zetten. De zaal staat voor 15 april, 13:00–15:30, en Sandra van de schuldhulpverlening heeft bevestigd. Goed nieuws.
>
> Wat mij zorgen baart is de gemeente. Ik heb vorige week gemaild maar nog niks gehoord. Kun jij ze nabellen? Voor vrijdag graag, anders kunnen we het niet meenemen in het programma.
>
> De flyer: Jan heeft het te druk. Heb jij iemand die dat kan maken? Volgende week af graag.
>
> De kinderopvang tijdens de middag is nog helemaal niet geregeld. Laten we dit week even afstemmen.
>
> Groetjes, Marieke

---

**Onderdeel 4.2.B — De opdracht**

"Schrijf een prompt die AI vraagt om een actielijst te maken uit deze mail, met per punt: wat er moet gebeuren, door wie, en wanneer. Onderscheid ook wat al geregeld is van wat nog open staat. Gebruik het instructieblok. Plak je prompt en de eerste vijf regels van het resultaat terug."

**[AI-AANROEP]**

`[SYSTEM-PROMPT]`  
Je bent een coach voor vrijwilligers die leren werken met AI. Je beoordeelt of de prompt duidelijk maakt dat de mail volledig moet worden meegenomen en of de gewenste structuur van de actielijst concreet is geformuleerd. Beoordeel ook wat AI goed heeft kunnen oppikken en wat het mogelijk heeft gemist. Maximaal 100 woorden. Schrijf in het Nederlands.

`[VOORBEELDANTWOORD]`  
"Lees de volgende mail van een collega. Maak een gestructureerde actielijst met drie kolommen: wat er moet gebeuren, wie dat moet doen, en wanneer de deadline is. Onderscheid ook duidelijk wat al geregeld is van wat nog open staat. [plak de mail hierboven]"

---

### Les 3/4 — Draaiboek updaten en team informeren

**Duur:** ±15 minuten

**Onderdeel 4.3.A — De statusupdate van een collega**

De deelnemer heeft een vrije dag gehad. Een collega (Joost) heeft ondertussen wat taken opgepakt en stuurt de volgende update:

> **Van:** Joost
> **Onderwerp:** Even bijpraten, inloopmiddag
>
> Hey,
>
> Even een korte update over wat ik heb gedaan terwijl jij er niet was.
>
> Gemeente gebeld! Ze komen inderdaad. Ze brengen niet alleen een informatietafel mee over toeslagen en regelingen, maar sturen ook een sociaal werker die een eigen tafel wil hebben voor individuele gesprekken. Mooi, maar betekent wel dat we ruimte voor twee gemeentetafels nodig hebben.
>
> Ik heb ook wat uitstaan voor activiteiten voor de kinderen. Heb navraag gedaan bij een paar vrijwilligers, wacht nog op antwoord. Staat nu dus op: wachten op bevestiging.
>
> Oh, en via via hoorde ik dat iemand in de wijk schminkactiviteiten doet voor kinderen. Zou dat niet leuk zijn? Maar dat moet iemand nog concreet benaderen. Misschien iets voor jou?
>
> Groet, Joost

**Onderdeel 4.3.B — De opdracht**

Instructietekst plus het vaste instructieblok (zie module 4 introductie). Vraag: "Combineer het draaiboek van oefening 1 en de actielijst van oefening 2 met de statusupdate van Joost. Vraag AI om twee dingen: (1) het draaiboek bij te werken met de nieuwe informatie en (2) een korte informele update-mail naar het team te schrijven over de voortgang. Beide in één prompt, één resultaat. Plak je prompt en de eerste vijf regels van het resultaat terug."

**[AI-AANROEP]**

`[SYSTEM-PROMPT]`
Je bent een coach voor vrijwilligers die leren werken met AI. Je beoordeelt of de prompt de statusupdate van Joost heeft gecombineerd met het eerdere draaiboek en de actielijst. Controleer ook of de deelnemer AI heeft gevraagd om twee dingen te leveren: een bijgewerkt draaiboek én een update-mail. Sluit af met een oprecht compliment voor het doorlopen van alle drie de oefeningen. Maximaal 120 woorden. Schrijf in het Nederlands.

`[VOORBEELDANTWOORD]`
"Je bent een coördinator bij een wijkorganisatie. Gebruik het volgende draaiboek [plak draaiboek], de actielijst [plak actielijst] en de statusupdate van een collega [plak update Joost].

Lever twee dingen op:
1. Een bijgewerkt draaiboek dat de nieuwe informatie verwerkt: twee gemeentetafels, activiteiten voor kinderen (status: wachten op bevestiging), en de mogelijkheid voor schminkactiviteiten (nog te bevestigen).
2. Een korte, informele update-mail aan het team (maximaal 100 woorden) over de voortgang en wat er nog open staat.

Houd het draaiboek maximaal twee pagina's A4. Toon voor de mail: collegiaal en praktisch."

### Les 4/4 — Jouw eigen taak

**Duur:** ±8 minuten

**Doel:** De deelnemer sluit de module af door de drie oefeningen te verbinden aan zijn eigen werk.

---

**Onderdeel 4.4.A — De opdracht**

Als de deelnemer in module 1 een eigen taak heeft opgeslagen, verschijnt de volgende tekst:

"Je schreef in module 1 dat je [[module1_eigen_taak]] als eerste met AI wil proberen. Schrijf nu een prompt voor die taak. Gebruik ROL, TAAK en CONTEXT. Je hoeft het resultaat niet terug te brengen in de cursus. Dit is puur voor jou."

Als er geen antwoord is opgeslagen: "Kies een taak uit jouw eigen werk die je regelmatig doet. Schrijf daarvoor een prompt met ROL, TAAK en CONTEXT. Dit is puur voor jou, er is geen beoordeling."

Er is een tekstveld. Er is een knop "Sla op voor mezelf" die de prompt opslaat in `localStorage`. Er is geen AI-aanroep in dit onderdeel. Het is een zelfstandige oefening.

**Afsluittekst van module 4:** "Module 4 voltooid. Je hebt drie werkende AI-processen gemaakt die je direct kunt hergebruiken."

---

## Module 5: Afsluiting en certificaat

**Duur:** 15 minuten  
**Doel:** De cursus afsluiten met een persoonlijk actieplan en een downloadbaar certificaat.  
**Toon:** Warm, afsluitend, geen nieuwe leerstof meer.

---

### Scherm 5.1 — Terugblik

**Wat de deelnemer ziet:**

Een overzicht van de voltooide modules met per module één kernzin:

- Module 1: "Je begrijpt hoe AI werkt en hoe je het kritisch gebruikt."
- Module 2: "Je weet hoe je AI veilig inzet voor de mensen die jij helpt."
- Module 3: "Je schrijft prompts met ROL, TAAK en CONTEXT."
- Module 4: "Je hebt drie werkende AI-processen gemaakt."

Daarna de tekst: "Je hebt de hele cursus doorlopen. Voordat je het certificaat ontvangt, vragen we je om één concrete stap te kiezen."

---

### Scherm 5.2 — Actieplan

**Wat de deelnemer ziet:**

Drie invulvelden:

1. "Welke taak doe ik komende week anders met AI?" — vrij tekstveld
2. "Wanneer ga ik dat proberen?" — vrij tekstveld (geen datumkiezer, gewoon tekst)
3. "Wat verwacht ik dat anders gaat?" — vrij tekstveld

Knop: "Bewaar mijn actieplan"

Na opslaan verschijnt: "Je actieplan is opgeslagen in je browser. Je kunt het altijd terugvinden via de navigatie." Daarna een knop: "Ontvang mijn certificaat."

---

### Scherm 5.3 — Certificaat

**Wat de deelnemer ziet:**

Een invoerveld: "Hoe moet jouw naam op het certificaat staan?"

Daarna een voorvertoning van het certificaat met de volgende elementen:
- Koptekst: "Certificaat van voltooiing"
- "[Naam] heeft de e-learning Werken met AI volledig doorlopen en alle opdrachten voltooid."
- Datum: de huidige datum, automatisch ingevuld
- "Timon Kool | timonkool.nl"
- Een saliegroene rand, passend bij de stijlgids

Knop: "Download certificaat (PDF)"

De PDF wordt gegenereerd in de browser via een bestaande PDF-bibliotheek (jsPDF of vergelijkbaar).

De vaste opmaak van het certificaat staat los van de deelnemer: alleen de naam en de datum worden dynamisch ingevuld, de rest is identiek voor iedereen. Het referentie-ontwerp staat in context/Voorbeeld_certificaat.html. Claude Code gebruikt dat bestand als exacte visuele leidraad voor de lay-out, kleuren en opbouw.

---

### Scherm 5.4 — Eindscherm

**Wat de deelnemer ziet:**

Groot en warm: "Je hebt de cursus afgerond."

Een overzicht van de voltooide modules. Een knop "Download mijn certificaat opnieuw." Een knop "Begin opnieuw" die na een bevestigingsvraag alle voortgang wist.

---

## Navigatie en voortgang

### Voortgangsindicator

De navigatie toont per module:
- Een modulenummer en naam
- Een kleine voortgangsbalk per module
- Een groen vinkje bij voltooide modules
- Een markering bij de huidige module

Op een telefoon is de navigatie verborgen achter een menuknop linksboven. Die opent de navigatie als overlay.

### Voortgangsopslag

De voortgang wordt opgeslagen via `localStorage`. De deelnemer kan de browser sluiten en terugkeren op dezelfde plek.

Onderaan de navigatie staat: "Je voortgang wordt bewaard in deze browser. Wis je je browsergegevens, dan begint de cursus opnieuw."

---

## Foutmeldingen voor API-aanroepen (geldig voor de hele cursus)

Alle foutmeldingen verschijnen in beeld als tekst in een kader, nooit als pop-up:

- Ongeldige sleutel: "Je API-sleutel klopt niet. Controleer of je hem goed hebt geplakt via de knop 'Sleutel wijzigen'."
- Te veel verzoeken (rate limit): "Je hebt het tijdelijke limiet bereikt. Wacht even en probeer opnieuw."
- Geen internetverbinding: "Geen verbinding. Controleer je internet en probeer opnieuw."
- Onbekende fout: "Er ging iets mis. Probeer het opnieuw of ververs de pagina."

Bij elke fout is er een knop "Probeer opnieuw" die de aanroep herhaalt zonder de pagina te herladen.

---

## Overzicht van alle API-aanroepen in de cursus

| Module | Les | Type aanroep | Max tokens | Doel |
|--------|-----|--------------|------------|------|
| 0 | Successcherm | Welkomstbericht | 300 | Persoonlijk welkom na sleutelkoppeling |
| 1 | Les 1 | HTML-flyer genereren | 4000 | Wow-moment: visuele flyer |
| 1 | Les 4 | Feedbacktaak | 800 | Beoordeling eigen uitleg van AI |
| 2 | Les 3 | Feedbacktaak | 800 | Beoordeling anonimisering |
| 3 | Les 3 | Feedbacktaak | 800 | Beoordeling verbeterde prompt |
| 3 | Les 4 | Feedbacktaak | 800 | Beoordeling eigen prompt |
| 4 | Les 1 | Feedbacktaak | 800 | Beoordeling draaiboek-prompt |
| 4 | Les 2 | Feedbacktaak | 800 | Beoordeling actielijst-prompt |
| 4 | Les 3 | Feedbacktaak | 800 | Beoordeling statusupdate-prompt |

**Totaal: 9 API-aanroepen per volledige cursusrun.**

Geschatte kosten per deelnemer bij Sonnet 4.6: ±$0,17

De kostenwaarschuwing wordt getoond bij 50 aanroepen (inclusief herhaalpogingen). Bij normale doorloop is dat niet bereikbaar.

---

*Einde inhoudsbrief — versie 2.0*
