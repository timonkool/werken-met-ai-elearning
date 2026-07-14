import React, { useState, useRef } from 'react'
import Kennischeck from '../../components/Kennischeck.jsx'
import OpdrachtFeedback from '../../components/OpdrachtFeedback.jsx'
import ModuleAfsluiting from '../../components/ModuleAfsluiting.jsx'
import { useAnthropicApi } from '../../hooks/useAnthropicApi.js'
import { useVoortgang } from '../../hooks/useVoortgang.js'

// Module 1 heeft twee bijzondere lessen (flyer en klikbare zinnen) naast twee
// standaard lessen. De inhoud komt uit cursus.json; deze component bepaalt de
// weergave per les.
export default function Module1({ module, onVolgende }) {
  const { setLesVoortgang, isModuleVoltooid, setModuleVoltooid } = useVoortgang()
  const lessen = module.lessen
  const les1 = lessen.find((l) => l.id === 'les-1-1')
  const les2 = lessen.find((l) => l.id === 'les-1-2')
  const les3 = lessen.find((l) => l.id === 'les-1-3')
  const les4 = lessen.find((l) => l.id === 'les-1-4')

  const voltooid = isModuleVoltooid('module-1')

  function markeerLes(lesId) {
    setLesVoortgang(lesId, { afgerond: true, antwoord: '' })
  }

  return (
    <>
      <FlyerLes les={les1} onKlaar={() => markeerLes(les1.id)} />

      <HoeWerktAiLes les={les2} onAfgerond={() => markeerLes(les2.id)} />

      <KlikbareZinnenLes les={les3} onAfgerond={() => markeerLes(les3.id)} />

      <EersteOpdrachtLes
        les={les4}
        onAfgerond={() => setModuleVoltooid('module-1')}
      />

      {voltooid && (
        <ModuleAfsluiting tekst={module.afsluittekst} onVolgende={onVolgende} />
      )}
    </>
  )
}

/* ─── Les 1: Het wow-moment (flyer) ──────────────────────────── */

function extractHtml(tekst) {
  let t = tekst.trim()
  // Verwijder een eventueel markdown-codeblok rondom de HTML
  const fence = t.match(/```(?:html)?\s*([\s\S]*?)```/i)
  if (fence) t = fence[1].trim()
  const doc = t.toLowerCase().indexOf('<!doctype')
  if (doc >= 0) return t.slice(doc)
  const html = t.toLowerCase().indexOf('<html')
  if (html >= 0) return t.slice(html)
  const lt = t.indexOf('<')
  return lt >= 0 ? t.slice(lt) : t
}

function FlyerLes({ les, onKlaar }) {
  const { stuurVerzoek, laden, fout } = useAnthropicApi()
  const [prompt, setPrompt] = useState(les.standaard_prompt)
  const [flyerHtml, setFlyerHtml] = useState(null)
  const [duur, setDuur] = useState(null)
  const [gekopieerd, setGekopieerd] = useState(false)

  const [reflectie, setReflectie] = useState(
    () => localStorage.getItem(les.reflectie.opslag_key) || ''
  )
  const [reflectieKlaar, setReflectieKlaar] = useState(false)
  const [reflectieFout, setReflectieFout] = useState(null)
  const [gekozenTaken, setGekozenTaken] = useState([])
  const [herkenningKlaar, setHerkenningKlaar] = useState(false)

  async function maakFlyer() {
    setFlyerHtml(null)
    setGekopieerd(false)
    const start = performance.now()
    const resultaat = await stuurVerzoek(prompt, les.flyer_systeeminstructie, 4000)
    if (resultaat) {
      const seconden = Math.max(1, Math.round((performance.now() - start) / 1000))
      setDuur(seconden)
      setFlyerHtml(extractHtml(resultaat))
    }
  }

  async function kopieer() {
    try {
      await navigator.clipboard.writeText(flyerHtml)
      setGekopieerd(true)
      setTimeout(() => setGekopieerd(false), 2000)
    } catch {
      setGekopieerd(false)
    }
  }

  function bewaarReflectie() {
    if (!reflectie.trim()) {
      setReflectieFout('Schrijf eerst kort op wat je opvalt. Eén zin is al genoeg.')
      return
    }
    setReflectieFout(null)
    localStorage.setItem(les.reflectie.opslag_key, reflectie)
    setReflectieKlaar(true)
    onKlaar()
  }

  function kiesTaak(i) {
    setGekozenTaken((huidig) =>
      huidig.includes(i) ? huidig.filter((x) => x !== i) : [...huidig, i]
    )
  }

  return (
    <section className="les les-flyer">
      <h2 className="lesblok-titel">{les.titel}</h2>

      {/* 1.1.A — tweedelige tijdsvergelijking */}
      <div className="flyer-vergelijking">
        <div className="flyer-kolom flyer-kolom--zonder">
          <p className="flyer-kolom-tijd flyer-kolom-tijd--rood">{les.tijdsvergelijking.zonder.tijd}</p>
          <h3 className="flyer-kolom-titel">{les.tijdsvergelijking.zonder.titel}</h3>
          <ol className="flyer-stappen">
            {les.tijdsvergelijking.zonder.stappen.map((stap, i) => (
              <li key={i}>{stap}</li>
            ))}
          </ol>
        </div>

        <div className="flyer-kolom flyer-kolom--met">
          <p className="flyer-kolom-tijd flyer-kolom-tijd--groen">{les.tijdsvergelijking.met.tijd}</p>
          <h3 className="flyer-kolom-titel">{les.tijdsvergelijking.met.titel}</h3>

          <div className="flyer-resultaat">
            {laden && (
              <div className="flyer-laden">
                <span className="lesblok-laden-stip" />
                <span className="lesblok-laden-stip" />
                <span className="lesblok-laden-stip" />
                <p>{les.laadtekst}</p>
              </div>
            )}

            {!laden && !flyerHtml && !fout && (
              <p className="flyer-resultaat-leeg">{les.tijdsvergelijking.met.placeholder}</p>
            )}

            {fout && !laden && (
              <div className="lesblok-fout">
                <p>{fout}</p>
                <button className="secondary" onClick={maakFlyer}>Probeer opnieuw</button>
              </div>
            )}

            {flyerHtml && !laden && (
              <>
                <div className="flyer-balk">
                  <span className="flyer-stopwatch">Jouw flyer was klaar in {duur} seconden.</span>
                  <button className="secondary flyer-kopieer" onClick={kopieer}>
                    {gekopieerd ? 'Gekopieerd ✓' : 'Kopieer HTML-code'}
                  </button>
                </div>
                <iframe
                  className="flyer-iframe"
                  title="Jouw flyer"
                  srcDoc={flyerHtml}
                  sandbox=""
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* 1.1.B + 1.1.C — aanpasbare prompt en genereerknop */}
      <p className="flyer-prompt-instructie">{les.prompt_instructie}</p>
      <textarea
        className="flyer-prompt-veld"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button className="primary flyer-genereer" onClick={maakFlyer} disabled={laden}>
        {les.genereer_knop}
      </button>

      {/* 1.1.D — open reflectievraag (pas na het maken van een flyer) */}
      {flyerHtml && (
        <div className="flyer-reflectie">
          <p className="flyer-reflectie-vraag">{les.reflectie.vraag}</p>
          <textarea
            className="opdrachtblok-veld"
            value={reflectie}
            onChange={(e) => {
              setReflectie(e.target.value)
              if (reflectieFout) setReflectieFout(null)
            }}
            placeholder="Schrijf hier kort wat je opvalt..."
          />
          {reflectieFout && <p className="lesblok-inline-fout">{reflectieFout}</p>}
          {!reflectieKlaar ? (
            <button className="primary" onClick={bewaarReflectie}>{les.reflectie.knop}</button>
          ) : (
            <span className="lesblok-afgerond"><i className="ph-bold ph-check" aria-hidden="true" /> Bewaard</span>
          )}
        </div>
      )}

      {/* 1.1.E — herkenningskaartjes */}
      {reflectieKlaar && (
        <div className="flyer-herkenning">
          <p className="flyer-herkenning-instructie">{les.herkenning.instructie}</p>
          <div className="herkenning-grid">
            {les.herkenning.kaartjes.map((kaart, i) => (
              <button
                key={i}
                className={
                  'herkenning-kaart' + (gekozenTaken.includes(i) ? ' herkenning-kaart--gekozen' : '')
                }
                onClick={() => kiesTaak(i)}
              >
                <span className="herkenning-kaart-vink">{gekozenTaken.includes(i) ? '✓' : ''}</span>
                <span>{kaart}</span>
              </button>
            ))}
          </div>
          {!herkenningKlaar ? (
            <button className="primary" onClick={() => setHerkenningKlaar(true)}>
              {les.herkenning.knop}
            </button>
          ) : (
            <p className="flyer-herkenning-na">{les.herkenning.na_tekst}</p>
          )}
        </div>
      )}
    </section>
  )
}

/* ─── Les 2: Hoe werkt AI? (citaat + twee kaarten + kennischeck) ── */

function HoeWerktAiLes({ les, onAfgerond }) {
  return (
    <section className="les">
      <h2 className="lesblok-titel">{les.titel}</h2>

      {/* 1.2.A — belezen collega-analogie als lead */}
      <blockquote className="les-citaat">
        {les.citaat.split('\n\n').map((alinea, i) => (
          <p key={i}>{alinea}</p>
        ))}
      </blockquote>

      {/* 1.2.B — twee eigenschappenkaarten */}
      <div className="kaarten-duo">
        <div className="kaart kaart--goed">
          <h3 className="kaart-titel">{les.eigenschappen.goed.titel}</h3>
          <ul className="kaart-lijst">
            {les.eigenschappen.goed.punten.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
        <div className="kaart kaart--niet">
          <h3 className="kaart-titel">{les.eigenschappen.niet.titel}</h3>
          <ul className="kaart-lijst">
            {les.eigenschappen.niet.punten.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      </div>

      {/* 1.2.C — kennischeck */}
      <Kennischeck check={les.kennischeck} onBeantwoord={onAfgerond} />
    </section>
  )
}

/* ─── Les 3: AI liegt geloofwaardig (klikbare zinnen) ──────────── */

function KlikbareZinnenLes({ les, onAfgerond }) {
  const [geselecteerd, setGeselecteerd] = useState({})
  const [onthuld, setOnthuld] = useState(false)

  function sleutel(a, z) {
    return `${a}-${z}`
  }

  function kiesZin(a, z) {
    if (onthuld) return
    const k = sleutel(a, z)
    setGeselecteerd((huidig) => ({ ...huidig, [k]: !huidig[k] }))
  }

  function onthul() {
    setOnthuld(true)
    onAfgerond()
  }

  async function downloadKaartje() {
    // jsPDF is fors en alleen nodig bij deze download; laad hem pas nu
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    doc.setFillColor(238, 242, 236)
    doc.rect(20, 20, 170, 90, 'F')
    doc.setDrawColor(107, 128, 104)
    doc.setLineWidth(1)
    doc.line(20, 20, 20, 110)
    doc.setTextColor(58, 74, 56)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text(les.bewaarkaartje.titel, 30, 38)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(13)
    doc.setTextColor(45, 53, 44)
    les.bewaarkaartje.punten.forEach((punt, i) => {
      doc.text(`•  ${punt}`, 30, 52 + i * 11)
    })
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 104)
    doc.text('Werken met AI  ·  timonkool.nl', 30, 124)
    doc.save('controleer-altijd-bij.pdf')
  }

  return (
    <section className="les">
      <h2 className="lesblok-titel">{les.titel}</h2>

      {/* 1.3.A + 1.3.B — tekst met verborgen fouten, klikbaar per zin */}
      <p className="klik-inleiding">{les.inleiding}</p>
      <p className="klik-instructie">{onthuld ? les.na_onthulling : les.instructie}</p>

      <div className="klik-document">
        <h3 className="klik-document-titel">{les.document.titel}</h3>
        {les.document.alineas.map((alinea, a) => (
          <p key={a} className="klik-alinea">
            {alinea.map((zin, z) => {
              const k = sleutel(a, z)
              const gekozen = !!geselecteerd[k]
              let klasse = 'klik-zin'
              if (!onthuld && gekozen) klasse += ' klik-zin--gekozen'
              if (onthuld) {
                if (zin.fout) klasse += gekozen ? ' klik-zin--fout-gekozen' : ' klik-zin--fout'
                else if (gekozen) klasse += ' klik-zin--goed'
              }
              return (
                <React.Fragment key={z}>
                  <span className={klasse} onClick={() => kiesZin(a, z)}>{zin.tekst}</span>{' '}
                </React.Fragment>
              )
            })}
          </p>
        ))}
      </div>

      {/* Uitleg per foutieve zin, pas na onthullen */}
      {onthuld && (
        <div className="klik-uitleg-lijst">
          {les.document.alineas.flat().filter((z) => z.fout).map((zin, i) => (
            <div key={i} className="klik-uitleg">
              <p className="klik-uitleg-citaat">"{zin.tekst}"</p>
              <p>{zin.uitleg}</p>
            </div>
          ))}
        </div>
      )}

      {!onthuld && (
        <button className="primary klik-onthul" onClick={onthul}>{les.onthul_knop}</button>
      )}

      {/* 1.3.C — bewaarkaartje */}
      <div className="bewaarkaartje">
        <h3 className="bewaarkaartje-titel">{les.bewaarkaartje.titel}</h3>
        <ul className="bewaarkaartje-lijst">
          {les.bewaarkaartje.punten.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
        <button className="secondary" onClick={downloadKaartje}>{les.bewaarkaartje.download_knop}</button>
      </div>

      {/* 1.3.D — kennischeck */}
      <Kennischeck check={les.kennischeck} />
    </section>
  )
}

/* ─── Les 4: Jouw eerste opdracht (feedback + afsluitvraag) ─────── */

function EersteOpdrachtLes({ les, onAfgerond }) {
  const [eigenTaak, setEigenTaak] = useState(
    () => localStorage.getItem(les.afsluitvraag.opslag_key) || ''
  )

  function afronden() {
    localStorage.setItem(les.afsluitvraag.opslag_key, eigenTaak)
    onAfgerond()
  }

  const afsluitvraagBlok = () => (
    <div className="afsluitvraag">
      <p className="afsluitvraag-vraag">{les.afsluitvraag.vraag}</p>
      <textarea
        className="opdrachtblok-veld"
        value={eigenTaak}
        onChange={(e) => setEigenTaak(e.target.value)}
        placeholder="Schrijf hier je antwoord..."
      />
    </div>
  )

  return (
    <section className="les">
      <h2 className="lesblok-titel">{les.titel}</h2>
      <OpdrachtFeedback
        lesId={les.id}
        opdracht={les.opdracht}
        afrondLabel={les.afsluitvraag.knop}
        onAfgerond={afronden}
        renderNaFeedback={afsluitvraagBlok}
        valideerAfronding={() =>
          eigenTaak.trim()
            ? null
            : 'Vul eerst in welke taak jij als eerste wilt proberen. Een paar woorden is genoeg.'
        }
      />
    </section>
  )
}
