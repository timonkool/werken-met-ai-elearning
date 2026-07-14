import React, { useState } from 'react'
import { useVoortgang } from '../../hooks/useVoortgang.js'
import { TOEGANGSCODE_KEY } from '../../hooks/useAnthropicApi.js'
import { downloadCertificaat } from './certificaatPdf.js'

// Module 5 sluit de cursus af: terugblik, persoonlijk actieplan, certificaat
// en een eindscherm. Er is geen AI-aanroep in deze module. De vier schermen
// staan na elkaar; welk scherm als eerste getoond wordt, hangt af van wat
// er al is opgeslagen (zodat een terugkerende deelnemer niet opnieuw
// hoeft te beginnen). Het certificaat is pas te downloaden als module 1
// t/m 4 voltooid zijn; het bevestigt immers dat alle opdrachten af zijn.
export default function Module5({ module, modules }) {
  const { isModuleVoltooid, setModuleVoltooid } = useVoortgang()
  const voltooid = isModuleVoltooid('module-5')

  const openModules = (modules || []).filter(
    (m) =>
      ['module-1', 'module-2', 'module-3', 'module-4'].includes(m.id) &&
      !isModuleVoltooid(m.id)
  )

  const [scherm, setScherm] = useState(() => {
    if (voltooid) return 'eindscherm'
    if (localStorage.getItem(module.actieplan.opslag_key)) return 'certificaat'
    return 'terugblik'
  })

  function certificaatAfgerond() {
    setModuleVoltooid('module-5')
    setScherm('eindscherm')
  }

  return (
    <>
      {scherm === 'terugblik' && (
        <Terugblik data={module.terugblik} onVerder={() => setScherm('actieplan')} />
      )}

      {scherm === 'actieplan' && (
        <Actieplan data={module.actieplan} onVerder={() => setScherm('certificaat')} />
      )}

      {scherm === 'certificaat' && (
        <Certificaat
          data={module.certificaat}
          openModules={openModules}
          onAfgerond={certificaatAfgerond}
        />
      )}

      {scherm === 'eindscherm' && (
        <Eindscherm eindscherm={module.eindscherm} terugblik={module.terugblik} certificaatData={module.certificaat} />
      )}
    </>
  )
}

/* ─── 5.1 Terugblik ─────────────────────────────────────────────── */

function Terugblik({ data, onVerder }) {
  return (
    <section className="les">
      <h2 className="lesblok-titel">{data.titel}</h2>
      <ul className="m5-kernzin-lijst">
        {data.kernzinnen.map((k) => (
          <li key={k.module} className="m5-kernzin">
            <span className="m5-kernzin-vink"><i className="ph-bold ph-check" aria-hidden="true" /></span>
            <div>
              <span className="m5-kernzin-module">{k.module}</span>
              <p className="m5-kernzin-zin">{k.zin}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="m5-afsluittekst">{data.afsluittekst}</p>
      <button className="primary" onClick={onVerder}>{data.knop}</button>
    </section>
  )
}

/* ─── 5.2 Actieplan ─────────────────────────────────────────────── */

function Actieplan({ data, onVerder }) {
  const opgeslagen = (() => {
    try {
      return JSON.parse(localStorage.getItem(data.opslag_key) || '{}')
    } catch {
      return {}
    }
  })()

  const [antwoorden, setAntwoorden] = useState(() => {
    const init = {}
    data.vragen.forEach((v) => { init[v.id] = opgeslagen[v.id] || '' })
    return init
  })
  const [bewaard, setBewaard] = useState(Boolean(localStorage.getItem(data.opslag_key)))
  const [fout, setFout] = useState(null)

  function wijzig(id, waarde) {
    setAntwoorden((huidig) => ({ ...huidig, [id]: waarde }))
    setBewaard(false)
    if (fout) setFout(null)
  }

  function bewaar() {
    const leeg = data.vragen.some((v) => !antwoorden[v.id].trim())
    if (leeg) {
      setFout('Vul eerst alle drie de vragen in. Eén zin per vraag is genoeg.')
      return
    }
    setFout(null)
    localStorage.setItem(data.opslag_key, JSON.stringify(antwoorden))
    setBewaard(true)
  }

  return (
    <section className="les">
      <h2 className="lesblok-titel">{data.titel}</h2>
      <p className="m5-actieplan-intro">{data.intro}</p>

      <div className="m5-actieplan">
        {data.vragen.map((v) => (
          <div key={v.id} className="m5-actieplan-veld">
            <label className="m5-actieplan-label" htmlFor={`actieplan-${v.id}`}>{v.vraag}</label>
            <textarea
              id={`actieplan-${v.id}`}
              value={antwoorden[v.id]}
              onChange={(e) => wijzig(v.id, e.target.value)}
              style={{ minHeight: '90px' }}
            />
          </div>
        ))}

        {fout && <p className="lesblok-inline-fout">{fout}</p>}

        <button className="primary" onClick={bewaar}>{data.knop}</button>

        {bewaard && (
          <div className="m5-actieplan-bevestiging">
            <p><i className="ph-bold ph-check" aria-hidden="true" /> {data.na_opslaan}</p>
            <button className="primary" onClick={onVerder}>{data.vervolg_knop}</button>
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── 5.3 Certificaat ───────────────────────────────────────────── */

function Certificaat({ data, openModules, onAfgerond }) {
  const [naam, setNaam] = useState(() => localStorage.getItem(data.opslag_key) || '')
  const [fout, setFout] = useState(false)

  const datumTekst = new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date())

  function wijzigNaam(waarde) {
    setNaam(waarde)
    if (waarde.trim()) setFout(false)
  }

  async function download() {
    const schoneNaam = naam.trim()
    if (!schoneNaam) {
      setFout(true)
      return
    }
    localStorage.setItem(data.opslag_key, schoneNaam)
    await downloadCertificaat(schoneNaam, data)
    onAfgerond()
  }

  return (
    <section className="les">
      <h2 className="lesblok-titel">{data.titel}</h2>

      <div className="opdrachtblok">
        <label className="m5-actieplan-label" htmlFor="certificaat-naam">{data.naam_label}</label>
        <p className="m5-naam-toelichting">{data.naam_toelichting}</p>
        <input
          id="certificaat-naam"
          className="m5-naam-veld"
          type="text"
          value={naam}
          onChange={(e) => wijzigNaam(e.target.value)}
          placeholder={data.naam_placeholder}
        />
        {fout && <p className="lesblok-inline-fout">{data.leeg_veld_fout}</p>}
      </div>

      <p className="m5-voorvertoning-label">{data.voorvertoning_label}</p>
      <CertificaatVoorvertoning data={data} naam={naam} datumTekst={datumTekst} />

      {openModules.length > 0 ? (
        <div className="m5-cert-vergrendeld">
          <p>{data.vergrendeld_tekst}</p>
          <ul>
            {openModules.map((m) => (
              <li key={m.id}>{m.titel}</li>
            ))}
          </ul>
        </div>
      ) : (
        <button className="primary" style={{ marginTop: '24px' }} onClick={download}>
          {data.download_knop}
        </button>
      )}
    </section>
  )
}

function CertificaatVoorvertoning({ data, naam, datumTekst }) {
  const weergaveNaam = naam.trim() || 'Naam van de deelnemer'

  return (
    <div className="m5-cert-wrap">
      <div className="m5-cert">
        <div className="m5-cert-band">
          <div className="m5-cert-band-top">
            <span className="m5-cert-band-icon"><i className="ph-bold ph-medal" aria-hidden="true" /></span>
            <span className="m5-cert-band-tekst">werken met ai</span>
          </div>
          <div className="m5-cert-band-onder">
            <span className="m5-cert-band-tekst m5-cert-band-tekst--klein">timonkool.nl</span>
          </div>
        </div>

        <div className="m5-cert-kader" />

        <div className="m5-cert-body">
          <div className="m5-cert-top">
            <span className="m5-cert-eyebrow">{data.eyebrow}</span>
            <span className="m5-cert-hoofdtitel">{data.hoofdtitel}</span>
          </div>

          <div className="m5-cert-mid">
            <span className="m5-cert-bevestigt">{data.bevestigt_regel}</span>
            <span className="m5-cert-naam">{weergaveNaam}</span>
            <div className="m5-cert-naam-lijn" />
            <p className="m5-cert-prestatie">{data.prestatie_tekst}</p>
            <div className="m5-cert-pillen">
              {data.modules_labels.map((label) => (
                <span key={label} className="m5-cert-pill">{label}</span>
              ))}
            </div>
          </div>

          <div className="m5-cert-onder">
            <div className="m5-cert-sig">
              <div className="m5-cert-sig-lijn" />
              <span className="m5-cert-sig-naam">{data.handtekening_naam}</span>
              <span className="m5-cert-sig-rol">{data.handtekening_rol}</span>
            </div>
            <div className="m5-cert-zegel">
              <span className="m5-cert-zegel-cirkel"><i className="ph-bold ph-seal-check" aria-hidden="true" /></span>
              <span className="m5-cert-zegel-tekst">voltooid</span>
            </div>
            <div className="m5-cert-datum">
              <span className="m5-cert-datum-label">datum</span>
              <span className="m5-cert-datum-waarde">{datumTekst}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── 5.4 Eindscherm ────────────────────────────────────────────── */

function Eindscherm({ eindscherm, terugblik, certificaatData }) {
  const [resetBevestigen, setResetBevestigen] = useState(false)

  function downloadOpnieuw() {
    const naam = (localStorage.getItem(certificaatData.opslag_key) || '').trim()
    if (!naam) return
    downloadCertificaat(naam, certificaatData)
  }

  function beginOpnieuw() {
    // De toegangscode is geen voortgang; die blijft staan zodat de deelnemer
    // hem niet opnieuw hoeft op te vragen bij de cursusbeheerder.
    const toegangscode = localStorage.getItem(TOEGANGSCODE_KEY)
    localStorage.clear()
    if (toegangscode) localStorage.setItem(TOEGANGSCODE_KEY, toegangscode)
    window.location.reload()
  }

  return (
    <section className="les m5-eindscherm">
      <h2 className="m5-eindscherm-titel">{eindscherm.titel}</h2>
      <p className="m5-eindscherm-tekst">{eindscherm.tekst}</p>

      <ul className="m5-kernzin-lijst">
        {terugblik.kernzinnen.map((k) => (
          <li key={k.module} className="m5-kernzin">
            <span className="m5-kernzin-vink"><i className="ph-bold ph-check" aria-hidden="true" /></span>
            <div>
              <span className="m5-kernzin-module">{k.module}</span>
              <p className="m5-kernzin-zin">{k.zin}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="m5-eindscherm-acties">
        <button className="secondary" onClick={downloadOpnieuw}>{eindscherm.download_opnieuw_knop}</button>
        {!resetBevestigen && (
          <button className="secondary" onClick={() => setResetBevestigen(true)}>{eindscherm.begin_opnieuw_knop}</button>
        )}
      </div>

      {resetBevestigen && (
        <div className="m5-reset-bevestiging">
          <p>{eindscherm.bevestiging_tekst}</p>
          <div className="m5-reset-bevestiging-acties">
            <button className="secondary" onClick={() => setResetBevestigen(false)}>{eindscherm.bevestiging_annuleer}</button>
            <button className="primary" onClick={beginOpnieuw}>{eindscherm.bevestiging_ja}</button>
          </div>
        </div>
      )}
    </section>
  )
}
