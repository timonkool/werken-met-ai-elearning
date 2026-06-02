# Stijlgids — Saliegroene rust

Visuele identiteit voor persoonlijk merk. Deze gids is bedoeld om consequent in deze stijl te kunnen werken, ongeacht het medium (website, mail, presentatie, social, drukwerk).

Geef deze gids in z'n geheel mee aan een AI als je iets in deze stijl wilt laten maken. De AI heeft hiermee genoeg om kleuren, typografie, ritme én de signature kleurwissel-techniek correct toe te passen.

---

## Kernprincipes

De stijl staat op vier pijlers. Houd je hieraan, dan blijft alles consistent.

1. **Rust boven flits.** Geen harde contrasten, geen drukke patronen. Het oog moet kunnen ademen.
2. **Saliegroen als anker.** Eén dominante kleurfamilie, gedempt en warm. Geen felle accenten.
3. **Subtiele rondingen.** Hoeken zijn altijd licht afgerond, nooit scherp en nooit overdreven rond.
4. **Eén signature truc.** De kleurwissel-kop (zie sectie verderop) is het herkenningselement. Gebruik hem spaarzaam, alleen voor titels die het zwaartepunt van een compositie vormen.

---

## Kleurpalet

### Primaire kleuren

| Naam | Hex | Gebruik |
|------|-----|---------|
| `--sage-deep` | `#6b8068` | Hoofdkleur. Vlakken, accenten, knoppen, koppen op cream |
| `--sage-ink` | `#3a4a38` | Donker groen voor body-tekst en koppen |
| `--cream` | `#faf8f4` | Warme witte hoofdachtergrond |

### Secundaire kleuren

| Naam | Hex | Gebruik |
|------|-----|---------|
| `--sage` | `#8ba287` | Lichter accent, lijnen, decoratie |
| `--sage-soft` | `#c8d4c4` | Zachte achtergronden, badges |
| `--sage-mist` | `#eef2ec` | Card-achtergronden, zeer subtiel |
| `--paper` | `#ffffff` | Puur wit, alleen waar cream te warm is |

### Tekst

| Naam | Hex | Gebruik |
|------|-----|---------|
| `--text` | `#2d352c` | Body-tekst |
| `--muted` | `#6b7268` | Secundaire tekst, captions |

### Regels voor kleurgebruik

- **Een groen vlak heeft altijd cream of paper als tekstkleur.** Nooit zwart of een ander groen.
- **Een cream vlak heeft `--sage-ink` of `--sage-deep` als koptekst.** Body in `--text` of `--muted`.
- **Geen andere kleuren toevoegen.** Geen rood, blauw, geel, oranje. Als je iets wilt benadrukken, gebruik dan grootte, gewicht of `--sage-deep` als accent.
- **Geen gradiënten.** Houd kleuren plat.

---

## Typografie

### Lettertypes

**Hoofdlettertype:** Quicksand (Google Fonts)
- Geometrische sans-serif met ronde karakter
- Voor alle koppen en body
- Gewichten: 300, 400, 500, 600, 700

**Accent-lettertype:** Fraunces (Google Fonts)
- Modern serif
- Alleen voor lead-citaten en lange zinnen waar je rust wilt creëren
- Vaak in italic 300

**Web-safe fallback (voor mail):** `'Trebuchet MS', Verdana, Arial, sans-serif`
- Gmail laadt geen Google Fonts. In handtekeningen en mailtemplates altijd deze stack gebruiken
- Trebuchet MS is de meest ronde web-safe sans, dichtst bij Quicksand qua karakter

### Schaal

| Element | Grootte | Gewicht | Line-height |
|---------|---------|---------|-------------|
| Display kop (kleurwissel) | 48-72px | 700 | 1 |
| H1 | 32-40px | 600 | 1.1 |
| H2 | 22-26px | 600 | 1.2 |
| H3 | 15-18px | 600 | 1.3 |
| Body | 13-15px | 400 | 1.6-1.7 |
| Lead/citaat | 16-18px | 300 (Fraunces italic) | 1.6 |
| Label/tag | 11px | 500 | 1 |
| Caption | 10-12px | 400 | 1.5 |

### Letter-spacing

- **Display koppen:** `-0.5px` tot `-1px` (dichter op elkaar voor visueel gewicht)
- **Body:** `0` (default)
- **Labels en caps:** `2px` tot `3px` (luchtig, ademt)

### Regels voor typografie

- **Labels en tags altijd in UPPERCASE met letter-spacing.** Dit is jouw secundaire ritme-element.
- **Body in zinnen, niet in opsommingen.** Bullet-lists alleen waar nodig.
- **Lead-citaat in serif italic met groene linkerlijn.** Dit is het tweede signature-element naast de kleurwissel-kop.

---

## Vormgeving

### Border-radius

| Naam | Waarde | Gebruik |
|------|--------|---------|
| `--radius-sm` | `6px` | Kleine elementen, badges |
| `--radius-md` | `10px` | Cards, inputs |
| `--radius-lg` | `12px` | Containers, hoofdblokken |
| `--radius-pill` | `999px` | Knoppen, capsules |

### Spacing

| Naam | Waarde | Gebruik |
|------|--------|---------|
| Edge padding | `28-32px` | Rand van containers |
| Block spacing | `24px` | Tussen secties |
| Element spacing | `12px` | Tussen verwante elementen |

### Schaduw

Subtiel of niets:

```css
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
```

Geen harde drop-shadows, geen neumorphism, geen glow.

### Lijnen

- Linker accent-lijn voor lead-tekst: `border-left: 3px solid #6b8068; padding-left: 14px;`
- Geen onderlijnen onder koppen
- Geen volledige randen om vlakken (alleen border-radius en background-kleur als visuele scheiding)

---

## De signature kleurwissel-kop

Dit is het herkenningselement. Een grote kop die op de grens tussen een groen vlak en een cream vlak valt, met:

1. **Witte letters** in het bovenste deel (in het groene vlak)
2. **Groen-op-groen overlap** als zachte overgangsstrook (groene letters die nog op het groene vlak liggen)
3. **De groen/cream-grens van het vlak**
4. **Groene letters** onder de grens (op cream)

### De truc, technisch

Twee identieke teksten worden over elkaar gepositioneerd. Elke tekst krijgt een `clip-path` die hem deels onzichtbaar maakt. De clips overlappen elkaar in een strook van enkele procenten — daar zien we beide kleuren tegelijk, wat de zachte overgang creëert.

### Werkende code (HTML/CSS)

```html
<style>
  /* De groene band waar de kop op valt */
  .header {
    background: #6b8068;
    height: 70px;
    padding: 14px 20px 0;
  }

  /* De zone waar de kleurwissel-kop staat. 
     Negatieve margin-top trekt de zone OMHOOG vanuit het volgende blok. */
  .title-zone {
    position: relative;
    height: 48px;          /* zelfde als font-size */
    margin: -32px 20px 0;  /* trekt de tekst grotendeels in de groene band */
  }

  /* Beide tekstlagen: zelfde positie, zelfde font, andere kleur, andere clip */
  .title {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 48px;
    font-weight: 700;
    line-height: 1;        /* compacte tekst-box, belangrijk voor clip */
    letter-spacing: -0.5px;
    white-space: nowrap;
    margin: 0;
  }

  /* Witte laag: zichtbaar in bovenste 50% van de tekst */
  .title-white {
    color: #faf8f4;
    clip-path: inset(0 0 50% 0);
  }

  /* Groene laag: zichtbaar vanaf 45% van de tekst.
     Tussen 45% en 50% overlappen ze - daar ontstaat de groen-op-groen strook */
  .title-green {
    color: #6b8068;
    clip-path: inset(45% 0 0 0);
  }
</style>

<div class="header">
  <div class="label">EDITIE APRIL 2026</div>
</div>
<div class="title-zone">
  <h1 class="title title-white">Jouw Tekst</h1>
  <h1 class="title title-green">Jouw Tekst</h1>
</div>
```

### Drie variabelen om aan te passen

Als je de kop wilt schalen, blijf bij deze verhoudingen:

| Variabele | Verhouding | Voorbeeld 1 (klein) | Voorbeeld 2 (groot) |
|-----------|-----------|---------------------|---------------------|
| `font-size` | basis | 48px | 72px |
| `title-zone height` | gelijk aan font-size | 48px | 72px |
| `title-zone margin-top` | `-(2/3 × font-size)` | `-32px` | `-48px` |
| `header height` | `≈ 1.5 × font-size` | 70px | 110px |

### De clip-percentages

| Witte clip | Groene clip | Effect |
|-----------|-------------|--------|
| `inset(0 0 50% 0)` | `inset(45% 0 0 0)` | **Standaard.** Subtiele groen-op-groen strook |
| `inset(0 0 55% 0)` | `inset(40% 0 0 0)` | Bredere overgangsstrook, meer rust |
| `inset(0 0 50% 0)` | `inset(50% 0 0 0)` | Geen overlap, hardere scheidslijn (vermijden) |

### Veelgemaakte fouten

- **`line-height: 1` weglaten.** Zonder line-height: 1 wordt de tekst-box te hoog (1.2 default), waardoor de glyphs niet meer in het midden van de box staan en de clip op de verkeerde plek valt. **Altijd `line-height: 1` op de kleurwissel-kop.**
- **Witte achtergrond gebruiken in plaats van cream.** Zorg dat de container achter de kleurwissel-kop `#faf8f4` is, niet `#ffffff`. Dat is een belangrijk deel van de warmte van de stijl.
- **De clips op precies 50/50 zetten.** Dit lijkt logisch maar geeft een harde scheiding. Houd 5% overlap aan voor de zachte overgang.
- **Te kleine font-size proberen.** Onder 32px wordt de truc lastig leesbaar. Bewaar deze kop voor titels die echt groot mogen zijn.
- **De kop in een mail-template plaatsen zonder afbeelding.** Gmail strippt clip-path. Voor mail moet de kleurwissel-kop een PNG-afbeelding zijn, geen HTML.

---

## Toepassingen per medium

### Website

- Hoofdcontainer in cream of paper
- Hero met groene band + kleurwissel-kop
- Cards met `--sage-mist` achtergrond, border-radius 10px
- Knoppen pill-vorm (`border-radius: 999px`), groen of cream afhankelijk van achtergrond
- Lead-tekst in Fraunces italic met groene linkerlijn

### Email (nieuwsbrief)

- Tabel-layout met inline styles (geen externe CSS)
- Web-safe fonts: `'Trebuchet MS', Verdana, Arial, sans-serif`
- Kleurwissel-kop **als PNG-afbeelding** (base64 ingebed of gehost)
- Cards en knoppen werken met `border-radius` in moderne mailclients
- Maximale breedte 600px

### Email (handtekening)

- Korte tabel met max 3 rijen: groen blok / kleurwissel-naam / cream contact-blok
- Voor de kleurwissel-naam-versie: PNG-afbeelding, niet HTML/CSS
- Voor minimalistische versie: alleen typografie met groene linkerlijn

### Presentatie (PowerPoint, Keynote, Google Slides)

- Achtergrond cream `#faf8f4`
- Eerste slide: groene band bovenin met kleurwissel-titel (gemaakt in een afbeelding-tool, geëxporteerd als PNG)
- Vervolgslides: titels in `--sage-ink`, body in `--text`
- Accent-elementen in `--sage-deep`
- Geen gradiënten, geen 3D-effecten, geen drop-shadows

### Social media posts

- Vierkant of 4:5 ratio
- Cream achtergrond met groen blok bovenin (1/3 hoogte)
- Kleurwissel-titel op de grens
- Quicksand 700 voor titels, Quicksand 400 voor body

### Drukwerk

- Pantone-equivalent voor `--sage-deep`: zoek een gedempt sage rond Pantone 5635 C of 5777 C (vraag een drukker om proefdruk)
- Cream `#faf8f4` is een warm wit, vraag uncoated paper voor een natuurlijke uitstraling
- Houd marges royaal (minimaal 15mm) voor de rust

---

## Tone of voice (kort)

De stijl heeft een visuele rust. Houd je tekst daarmee in lijn:

- **Korte zinnen.** Geen overload aan informatie.
- **Direct, niet schreeuwerig.** Geen uitroeptekens, geen overdreven adjectieven.
- **Specifiek boven algemeen.** "Drie dingen die deze maand toe doen" werkt beter dan "Allerlei nieuwtjes".
- **Lead-citaten in serif** dragen de toon. Gebruik ze om iets te benadrukken dat de lezer moet onthouden.

---

## AI-instructie sjabloon

Plak dit blok in je prompt als je iets in deze stijl wilt laten maken:

> Maak [website / mail / presentatie / poster] in deze visuele stijl:
>
> - Hoofdkleur saliegroen `#6b8068`, achtergrond warm cream `#faf8f4`, donkere tekst `#3a4a38`
> - Lettertype Quicksand (web) of Trebuchet MS (mail-fallback), Fraunces serif italic voor lead-citaten
> - Subtiele rondingen (8-12px), pill-knoppen, geen scherpe hoeken
> - Card-achtergronden in `#eef2ec`
> - Lead-tekst in serif italic met groene linkerlijn (3px solid `#6b8068`, padding-left 14px)
> - Sfeer: rustig, gedempt, warm. Geen felle contrasten, geen gradiënten, geen drop-shadows
> - Voor titels: gebruik de kleurwissel-techniek uit de stijlgids als de plek het toelaat
>
> Stijlgids in bijlage. Volg hem strikt.

---

## Verboden

- Andere kleuren dan saliegroen-familie en cream-familie
- Felle accentkleuren (rood, blauw, geel)
- Gradiënten van welke aard dan ook
- Drop-shadows zwaarder dan `0 4px 24px rgba(0,0,0,0.06)`
- Scherpe hoeken (border-radius 0)
- Hoofdletters door alles heen (alleen voor labels en tags)
- Underlines onder koppen
- Drie of meer fonts tegelijk (Quicksand + Fraunces is het maximum)
- Emojis in formele toepassingen
- Stockfoto's met onnatuurlijke kleurverzadiging
