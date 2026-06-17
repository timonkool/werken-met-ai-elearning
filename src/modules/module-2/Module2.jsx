import React from 'react'
import Kennischeck from '../../components/Kennischeck.jsx'
import OpdrachtFeedback from '../../components/OpdrachtFeedback.jsx'
import { useVoortgang } from '../../hooks/useVoortgang.js'

// Module 2 volgt het standaard lesblok, aangevuld met een situatieschets (les 1),
// een gouden regel met twee-kolommenkaart (les 2) en een anonimiseeropdracht
// met AI-feedback (les 3). Inhoud komt uit cursus.json.
export default function Module2({ module, onVolgende }) {
  const { setLesVoortgang, isModuleVoltooid, setModuleVoltooid } = useVoortgang()
  const lessen = module.lessen
  const les1 = lessen.find((l) => l.id === 'les-2-1')
  const les2 = lessen.find((l) => l.id === 'les-2-2')
  const les3 = lessen.find((l) => l.id === 'les-2-3')

  const voltooid = isModuleVoltooid('module-2')

  function markeerLes(lesId) {
    setLesVoortgang(lesId, { afgerond: true, antwoord: '' })
  }

  return (
    <>
      <DilemmaLes les={les1} onAfgerond={() => markeerLes(les1.id)} />

      <GoudenRegelLes les={les2} onAfgerond={() => markeerLes(les2.id)} />

      <OefenZelfLes les={les3} onAfgerond={() => setModuleVoltooid('module-2')} />

      {voltooid && (
        <ModuleAfsluiting tekst={module.afsluittekst} onVolgende={onVolgende} />
      )}
    </>
  )
}

/* ─── Les 1: Het dilemma ───────────────────────────────────────── */

function DilemmaLes({ les, onAfgerond }) {
  return (
    <section className="les">
      <h2 className="lesblok-titel">{les.titel}</h2>

      {/* 2.1.A — situatieschets */}
      <blockquote className="situatie">
        <p>{les.situatie}</p>
      </blockquote>
      <p className="situatie-vraag">{les.situatie_vraag}</p>

      {/* 2.1.B — kennischeck */}
      <Kennischeck check={les.kennischeck} onBeantwoord={onAfgerond} />

      {/* 2.1.C — overbrugging naar les 2 */}
      <div className="overbrugging">
        <p>{les.overbrugging}</p>
      </div>
    </section>
  )
}

/* ─── Les 2: De gouden regel ───────────────────────────────────── */

function GoudenRegelLes({ les, onAfgerond }) {
  return (
    <section className="les">
      <h2 className="lesblok-titel">{les.titel}</h2>

      {/* 2.2.A — de gouden regel */}
      <div className="gouden-regel">
        <p className="gouden-regel-tekst">{les.gouden_regel}</p>
      </div>
      <div className="gouden-regel-uitleg">
        {les.uitleg.map((alinea, i) => <p key={i}>{alinea}</p>)}
      </div>

      {/* 2.2.B — twee-kolommenkaart */}
      <div className="kaarten-duo">
        <div className="kaart kaart--niet">
          <h3 className="kaart-titel">{les.kolommen.nooit.titel}</h3>
          <ul className="kaart-lijst">
            {les.kolommen.nooit.punten.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
        <div className="kaart kaart--goed">
          <h3 className="kaart-titel">{les.kolommen.veilig.titel}</h3>
          <ul className="kaart-lijst">
            {les.kolommen.veilig.punten.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      </div>

      {/* 2.2.C — kennischeck */}
      <Kennischeck check={les.kennischeck} onBeantwoord={onAfgerond} />
    </section>
  )
}

/* ─── Les 3: Oefen zelf (anonimiseren met AI-feedback) ─────────── */

function OefenZelfLes({ les, onAfgerond }) {
  const inleiding = (
    <div className="originele-situatie">
      <p className="originele-situatie-label">De originele situatie</p>
      <p>{les.originele_situatie}</p>
    </div>
  )

  return (
    <section className="les">
      <h2 className="lesblok-titel">{les.titel}</h2>
      <OpdrachtFeedback
        lesId={les.id}
        opdracht={les.opdracht}
        inleiding={inleiding}
        placeholder="Schrijf hier je anonieme versie..."
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
