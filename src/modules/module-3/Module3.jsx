import React, { useState } from 'react'
import Kennischeck from '../../components/Kennischeck.jsx'
import OpdrachtFeedback from '../../components/OpdrachtFeedback.jsx'
import { useVoortgang } from '../../hooks/useVoortgang.js'

// Module 3 leert het schrijven van prompts met ROL, TAAK en CONTEXT.
// Les 1 = interactieve prompt-demo (geen AI-aanroep) + reflectie-kennischeck.
// Les 2 = drie uitlegkaarten + kennischeck + bonustechnieken.
// Les 3 en 4 = standaard opdracht met AI-feedback. Inhoud komt uit cursus.json.
export default function Module3({ module, onVolgende }) {
  const { setLesVoortgang, isModuleVoltooid, setModuleVoltooid } = useVoortgang()
  const lessen = module.lessen
  const les1 = lessen.find((l) => l.id === 'les-3-1')
  const les2 = lessen.find((l) => l.id === 'les-3-2')
  const les3 = lessen.find((l) => l.id === 'les-3-3')
  const les4 = lessen.find((l) => l.id === 'les-3-4')

  const voltooid = isModuleVoltooid('module-3')

  function markeerLes(lesId) {
    setLesVoortgang(lesId, { afgerond: true, antwoord: '' })
  }

  return (
    <>
      <ErvaarVerschilLes les={les1} onAfgerond={() => markeerLes(les1.id)} />

      <DrieElementenLes les={les2} onAfgerond={() => markeerLes(les2.id)} />

      <VerbeterPromptLes les={les3} onAfgerond={() => markeerLes(les3.id)} />

      <EigenPromptLes les={les4} onAfgerond={() => setModuleVoltooid('module-3')} />

      {voltooid && (
        <ModuleAfsluiting tekst={module.afsluittekst} onVolgende={onVolgende} />
      )}
    </>
  )
}

/* ─── Les 1: Ervaar het verschil (prompt-demo + kennischeck) ────── */

function ErvaarVerschilLes({ les, onAfgerond }) {
  return (
    <section className="les">
      <h2 className="lesblok-titel">{les.titel}</h2>

      {/* 3.1.A — de prompt-demo (vaste teksten, geen AI-aanroep) */}
      <PromptDemo demo={les.demo} />

      {/* 3.1.B — reflectievraag */}
      <Kennischeck check={les.kennischeck} onBeantwoord={onAfgerond} />
    </section>
  )
}

// Interactieve demo met twee standen. Een toggle wisselt tussen de slechte en
// de goede prompt. Alle teksten staan vast in cursus.json: geen API-aanroep,
// zodat iedereen exact hetzelfde contrast ziet en het geen tokens kost.
function PromptDemo({ demo }) {
  const [standIndex, setStandIndex] = useState(0)
  const stand = demo.standen[standIndex]
  const isGoed = stand.toon === 'groen'
  const toggleLabel = standIndex === 0 ? demo.toggle.naar_goed : demo.toggle.naar_slecht

  return (
    <div className="prompt-demo">
      <div className={'prompt-demo-vlag ' + (isGoed ? 'prompt-demo-vlag--goed' : 'prompt-demo-vlag--slecht')}>
        {stand.label}
      </div>

      <div className="prompt-chat">
        <div className="prompt-chat-rij prompt-chat-rij--vraag">
          <span className="prompt-chat-rol">Jij</span>
          <div className="prompt-chat-bel prompt-chat-bel--vraag">{stand.prompt}</div>
        </div>

        <div className="prompt-chat-rij prompt-chat-rij--antwoord">
          <span className="prompt-chat-rol">AI</span>
          <div className="prompt-chat-bel prompt-chat-bel--antwoord">
            {stand.antwoord.split('\n\n').map((alinea, i) => (
              <p key={i}>{alinea}</p>
            ))}
          </div>
        </div>
      </div>

      <p className={'prompt-demo-oordeel ' + (isGoed ? 'prompt-demo-oordeel--goed' : 'prompt-demo-oordeel--slecht')}>
        {stand.oordeel}
      </p>

      <button
        className="secondary prompt-demo-toggle"
        onClick={() => setStandIndex((i) => (i === 0 ? 1 : 0))}
      >
        {toggleLabel}
      </button>
    </div>
  )
}

/* ─── Les 2: De drie elementen (kaarten + kennischeck + bonus) ──── */

function DrieElementenLes({ les, onAfgerond }) {
  return (
    <section className="les">
      <h2 className="lesblok-titel">{les.titel}</h2>

      {/* 3.2.A — drie uitlegkaarten ROL, TAAK, CONTEXT */}
      <div className="element-kaarten">
        {les.elementen.map((el) => (
          <div key={el.naam} className="element-kaart">
            <div className="element-kaart-kop">
              <span className="element-kaart-nummer">{el.nummer}</span>
              <h3 className="element-kaart-naam">{el.naam}</h3>
            </div>
            <p className="element-kaart-uitleg">{el.uitleg}</p>
            <p className="element-kaart-voorbeeld">
              <span className="element-kaart-voorbeeld-label">Voorbeeld</span>
              {el.voorbeeld}
            </p>
          </div>
        ))}
      </div>

      {/* 3.2.B — kennischeck */}
      <Kennischeck check={les.kennischeck} onBeantwoord={onAfgerond} />

      {/* 3.2.C — vijf bonustechnieken */}
      <div className="bonus">
        <h3 className="bonus-titel">{les.bonus.titel}</h3>
        <ol className="bonus-lijst">
          {les.bonus.technieken.map((t, i) => (
            <li key={i}>
              <span className="bonus-kop">{t.kop}</span>
              <span className="bonus-tekst">{t.tekst}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ─── Les 3: Verbeter een slechte prompt (AI-feedback) ─────────── */

function VerbeterPromptLes({ les, onAfgerond }) {
  return (
    <section className="les">
      <h2 className="lesblok-titel">{les.titel}</h2>
      <OpdrachtFeedback
        lesId={les.id}
        opdracht={les.opdracht}
        nummer={1}
        placeholder="Schrijf hier je verbeterde prompt..."
        onAfgerond={onAfgerond}
      />
    </section>
  )
}

/* ─── Les 4: Schrijf een prompt voor je eigen werk (AI-feedback) ── */

function EigenPromptLes({ les, onAfgerond }) {
  return (
    <section className="les">
      <h2 className="lesblok-titel">{les.titel}</h2>
      <OpdrachtFeedback
        lesId={les.id}
        opdracht={les.opdracht}
        nummer={2}
        placeholder="Schrijf hier je eigen prompt..."
        afrondLabel="Bewaar mijn antwoord en sluit module 3 af"
        onAfgerond={onAfgerond}
      />
    </section>
  )
}

/* ─── Module-afsluiting ────────────────────────────────────────── */

function ModuleAfsluiting({ tekst, onVolgende }) {
  return (
    <div className="module-afsluiting">
      <span className="module-afsluiting-vink"><i className="ph-bold ph-check" aria-hidden="true" /></span>
      <p className="module-afsluiting-tekst">{tekst}</p>
      <button className="primary" onClick={onVolgende}>Volgende module</button>
    </div>
  )
}
