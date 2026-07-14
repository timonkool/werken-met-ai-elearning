import React, { useState } from 'react'
import OpdrachtFeedback from '../../components/OpdrachtFeedback.jsx'
import ModuleAfsluiting from '../../components/ModuleAfsluiting.jsx'
import { useVoortgang } from '../../hooks/useVoortgang.js'

// Module 4 is het hart van de cursus: drie doorlopende oefeningen rond één casus
// (een inloopmiddag voor mensen met geldzorgen) plus een vrije slotoefening.
// De deelnemer werkt in een externe AI-tool en brengt prompt + resultaat terug.
// Les 1 t/m 3 geven AI-feedback; les 4 is een zelfstandige oefening zonder
// AI-aanroep. Alle inhoud komt uit cursus.json.
export default function Module4({ module, onVolgende }) {
  const { setLesVoortgang, isModuleVoltooid, setModuleVoltooid } = useVoortgang()
  const lessen = module.lessen
  const les1 = lessen.find((l) => l.id === 'les-4-1')
  const les2 = lessen.find((l) => l.id === 'les-4-2')
  const les3 = lessen.find((l) => l.id === 'les-4-3')
  const les4 = lessen.find((l) => l.id === 'les-4-4')

  const voltooid = isModuleVoltooid('module-4')

  function markeerLes(lesId) {
    setLesVoortgang(lesId, { afgerond: true, antwoord: '' })
  }

  return (
    <>
      {/* Persoonlijk kader: toont het in module 1 opgeslagen antwoord */}
      <IntroKader intro={module.intro} />

      {/* 4.0 — de rode draad (uitlegscherm, geen opdracht) */}
      <RodeDraad rodeDraad={module.rode_draad} />

      <OefeningLes
        les={les1}
        nummer={1}
        instructieblok={module.instructieblok}
        placeholder="Plak hier je prompt en de eerste vijf regels van het resultaat..."
        onAfgerond={() => markeerLes(les1.id)}
      />

      <OefeningLes
        les={les2}
        nummer={2}
        instructieblok={module.instructieblok}
        placeholder="Plak hier je prompt en de eerste vijf regels van het resultaat..."
        onAfgerond={() => markeerLes(les2.id)}
      />

      <OefeningLes
        les={les3}
        nummer={3}
        instructieblok={module.instructieblok}
        placeholder="Plak hier je prompt en de eerste vijf regels van het resultaat..."
        onAfgerond={() => markeerLes(les3.id)}
      />

      <EigenTaakLes les={les4} onAfgerond={() => setModuleVoltooid('module-4')} />

      {voltooid && (
        <ModuleAfsluiting tekst={module.afsluittekst} onVolgende={onVolgende} />
      )}
    </>
  )
}

/* ─── Persoonlijk introkader ───────────────────────────────────── */

// Toont het antwoord dat de deelnemer in module 1 (les 4) opsloeg. Als er
// niets is opgeslagen, wordt het kader niet getoond.
function IntroKader({ intro }) {
  const eigenTaak = (localStorage.getItem(intro.bron_key) || '').trim()
  if (!eigenTaak) return null

  return (
    <div className="m4-intro">
      <p className="m4-intro-voor">{intro.voor}</p>
      <p className="m4-intro-taak">"{eigenTaak}"</p>
      <p className="m4-intro-na">{intro.na}</p>
    </div>
  )
}

/* ─── 4.0 De rode draad ────────────────────────────────────────── */

function RodeDraad({ rodeDraad }) {
  return (
    <section className="les m4-rodedraad">
      <h2 className="lesblok-titel">{rodeDraad.titel}</h2>
      {rodeDraad.alineas.map((alinea, i) => (
        <p key={i} className="m4-rodedraad-alinea">{alinea}</p>
      ))}
      <ol className="m4-rodedraad-stappen">
        {rodeDraad.stappen.map((stap, i) => (
          <li key={i}>{stap}</li>
        ))}
      </ol>
      <p className="m4-rodedraad-na">{rodeDraad.na}</p>
    </section>
  )
}

/* ─── Herbruikbaar instructieblok (externe tool) ───────────────── */

function Instructieblok({ tekst }) {
  return (
    <div className="m4-instructieblok">
      <span className="m4-instructieblok-label">In de echte AI-tool</span>
      <p>{tekst}</p>
    </div>
  )
}

/* ─── Casus-informatie (ruw plan / mail) ───────────────────────── */

function Informatie({ info }) {
  if (info.type === 'lijst') {
    return (
      <div className="m4-info m4-info--lijst">
        <h3 className="m4-info-titel">{info.titel}</h3>
        <ul className="m4-info-lijst">
          {info.punten.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </div>
    )
  }

  if (info.type === 'mail') {
    return (
      <>
        {info.intro && <p className="m4-info-intro">{info.intro}</p>}
        <div className="m4-info m4-info--mail">
          <div className="m4-mail-kop">
            <span><span className="m4-mail-veld">Van:</span> {info.van}</span>
            <span><span className="m4-mail-veld">Onderwerp:</span> {info.onderwerp}</span>
          </div>
          <div className="m4-mail-body">
            {info.regels.map((regel, i) => <p key={i}>{regel}</p>)}
          </div>
        </div>
      </>
    )
  }

  return null
}

/* ─── Les 1 t/m 3: oefening met externe tool + AI-feedback ─────── */

function OefeningLes({ les, nummer, instructieblok, placeholder, onAfgerond }) {
  return (
    <section className="les">
      <h2 className="lesblok-titel">{les.titel}</h2>

      {/* 4.x.A — de casus-informatie */}
      <Informatie info={les.informatie} />

      {/* Instructieblok boven elke opdracht met externe tool */}
      {les.externe_tool_vereist && <Instructieblok tekst={instructieblok} />}

      {/* 4.x.B — de opdracht met AI-feedback op de aanpak */}
      <OpdrachtFeedback
        lesId={les.id}
        opdracht={les.opdracht}
        nummer={nummer}
        placeholder={placeholder}
        onAfgerond={onAfgerond}
      />
    </section>
  )
}

/* ─── Les 4: jouw eigen taak (geen AI-aanroep) ─────────────────── */

function EigenTaakLes({ les, onAfgerond }) {
  const taak = les.eigen_taak
  const eigenTaakM1 = (localStorage.getItem(taak.bron_key) || '').trim()

  const [prompt, setPrompt] = useState(
    () => localStorage.getItem(taak.opslag_key) || ''
  )
  const [bewaard, setBewaard] = useState(false)
  const [afgerond, setAfgerond] = useState(false)
  const [fout, setFout] = useState(null)

  const LEEG_MELDING =
    'Schrijf eerst je prompt op. Hij hoeft niet perfect te zijn, je kunt hem later altijd aanpassen.'

  function bewaar() {
    if (!prompt.trim()) {
      setFout(LEEG_MELDING)
      return
    }
    setFout(null)
    localStorage.setItem(taak.opslag_key, prompt)
    setBewaard(true)
  }

  function afronden() {
    if (!prompt.trim()) {
      setFout(LEEG_MELDING)
      return
    }
    setFout(null)
    localStorage.setItem(taak.opslag_key, prompt)
    setAfgerond(true)
    onAfgerond()
  }

  return (
    <section className="les">
      <h2 className="lesblok-titel">{les.titel}</h2>
      <div className="opdrachtblok">
        <h3 className="opdrachtblok-kop">Opdracht 4</h3>
        {eigenTaakM1 ? (
          <p className="opdrachtblok-tekst">
            {taak.tekst_met_taak_voor} <span className="m4-eigen-taak-aanhaling">"{eigenTaakM1}"</span> {taak.tekst_met_taak_na}
          </p>
        ) : (
          <p className="opdrachtblok-tekst">{taak.tekst_zonder}</p>
        )}

        <textarea
          className="opdrachtblok-veld"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value)
            setBewaard(false)
            if (fout) setFout(null)
          }}
          placeholder={taak.placeholder}
        />

        {fout && <p className="lesblok-inline-fout">{fout}</p>}

        <div className="m4-eigen-taak-acties">
          {!bewaard ? (
            <button className="secondary" onClick={bewaar}>{taak.knop}</button>
          ) : (
            <span className="lesblok-afgerond"><i className="ph-bold ph-check" aria-hidden="true" /> Bewaard voor jezelf</span>
          )}

          {afgerond ? (
            <span className="lesblok-afgerond"><i className="ph-bold ph-check" aria-hidden="true" /> Afgerond</span>
          ) : (
            <button className="primary" onClick={afronden}>{taak.afrond_knop}</button>
          )}
        </div>
      </div>
    </section>
  )
}
