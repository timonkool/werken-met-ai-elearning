import React, { useState, useEffect } from 'react'
import ColorSwitchKop from '../../components/ColorSwitchKop.jsx'
import { controleerToegangscode, TOEGANGSCODE_KEY } from '../../hooks/useAnthropicApi.js'

// De deelnemer koppelt geen eigen Anthropic-sleutel meer; alle AI-verkeer
// loopt via de beveiligde proxy van de cursus. De deelnemer voert alleen de
// toegangscode in die hij van de cursusbeheerder heeft gekregen. De code
// wordt direct bij de proxy gecontroleerd voordat hij wordt opgeslagen.
export default function ApiKoppeling({ onVerbonden }) {
  const [code, setCode] = useState(() => localStorage.getItem(TOEGANGSCODE_KEY))
  const [invoer, setInvoer] = useState('')
  const [fout, setFout] = useState('')
  const [bezig, setBezig] = useState(false)
  const [wijzigenActief, setWijzigenActief] = useState(false)

  // Opruimen van het oude sleutel-model: een eventueel achtergebleven
  // Anthropic-sleutel hoort niet meer in de browser te staan.
  useEffect(() => {
    localStorage.removeItem('anthropic_api_key')
  }, [])

  async function verbind() {
    const schoneInvoer = invoer.trim()
    if (!schoneInvoer) {
      setFout('Vul eerst je toegangscode in.')
      return
    }

    setBezig(true)
    setFout('')
    const resultaat = await controleerToegangscode(schoneInvoer)
    setBezig(false)

    if (resultaat === 'geldig') {
      localStorage.setItem(TOEGANGSCODE_KEY, schoneInvoer)
      onVerbonden()
      return
    }
    if (resultaat === 'ongeldig') {
      setFout('Deze toegangscode klopt niet. Controleer of je hem precies zo hebt overgenomen als je hem hebt gekregen.')
      return
    }
    setFout('De cursus kan de code nu niet controleren. Controleer je internet en probeer het opnieuw.')
  }

  function verwijder() {
    localStorage.removeItem(TOEGANGSCODE_KEY)
    setCode(null)
    setInvoer('')
    setFout('')
    setWijzigenActief(false)
  }

  // Toon gekoppeld-scherm als er al een code is en niet in wijzig-modus
  if (code && !wijzigenActief) {
    return (
      <div className="api-koppeling">
        <ColorSwitchKop eyebrow="Module 0" size="clamp(30px, 6vw, 46px)">
          Je bent al verbonden
        </ColorSwitchKop>

        <div className="api-body">
          <p className="api-kop-tekst">
            Er is al een toegangscode opgeslagen in je browser.
            Je kunt gewoon doorgaan met de cursus.
          </p>

          <div className="api-gekoppeld-blok">
            <span className="api-vinkje"><i className="ph-bold ph-check" aria-hidden="true" /></span>
            <div>
              <p className="api-gekoppeld-titel">Je bent verbonden</p>
              <p className="api-gekoppeld-subtekst">
                Toegangscode eindigt op ···{code.slice(-4)}
              </p>
            </div>
          </div>

          <div className="api-gekoppeld-knoppen">
            <button
              className="secondary"
              onClick={() => setWijzigenActief(true)}
            >
              Code wijzigen
            </button>
            <button
              className="secondary api-verwijder-knop"
              onClick={verwijder}
            >
              Code verwijderen
            </button>
          </div>

          <button className="primary" style={{ marginTop: '8px' }} onClick={onVerbonden}>
            Doorgaan met de cursus
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="api-koppeling">

      <ColorSwitchKop eyebrow="Module 0 · Stap 2 van 3" size="clamp(30px, 6vw, 46px)">
        Vul je toegangscode in
      </ColorSwitchKop>

      <div className="api-body">
        <p className="api-kop-tekst">
          De AI-feedback zit ingebouwd in deze cursus. Je hoeft zelf niets aan
          te maken of te installeren. Het enige dat je nodig hebt is de
          toegangscode die je bij deze cursus hebt gekregen.
        </p>

        <ol className="api-stappen">

          <li className="api-stap">
            <span className="api-stap-nummer">1</span>
            <div className="api-stap-inhoud">
              <p className="api-stap-tekst">
                Pak de toegangscode erbij. Je hebt hem gekregen van de persoon
                of organisatie die jou deze cursus heeft aangeboden.
              </p>
            </div>
          </li>

          <li className="api-stap">
            <span className="api-stap-nummer">2</span>
            <div className="api-stap-inhoud">
              <p className="api-stap-tekst">
                Typ of plak de code in het veld hieronder en klik op "Verbind met de cursus".
              </p>
              <input
                type="password"
                className="api-invoer"
                placeholder="Jouw toegangscode"
                value={invoer}
                onChange={e => {
                  setInvoer(e.target.value)
                  if (fout) setFout('')
                }}
                onKeyDown={e => e.key === 'Enter' && !bezig && verbind()}
                autoComplete="off"
                spellCheck={false}
              />
              {fout && (
                <p className="api-fout">{fout}</p>
              )}
            </div>
          </li>

        </ol>

        <div className="api-acties">
          <button className="primary" onClick={verbind} disabled={bezig}>
            {bezig ? 'Code controleren...' : 'Verbind met de cursus'}
          </button>
        </div>

        <p className="api-geruststelling">
          Je code wordt alleen opgeslagen in jouw eigen browser. De cursus
          gebruikt hem uitsluitend om jou tijdens de lessen feedback te geven.
          Kwijt of werkt hij niet? Vraag dan een nieuwe code aan bij degene
          van wie je de cursus hebt gekregen.
        </p>
      </div>

    </div>
  )
}
