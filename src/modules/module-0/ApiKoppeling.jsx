import React, { useState } from 'react'
import ColorSwitchKop from '../../components/ColorSwitchKop.jsx'

const OPSLAG_KEY = 'anthropic_api_key'

export default function ApiKoppeling({ onVerbonden }) {
  const [sleutel, setSleutel] = useState(() => localStorage.getItem(OPSLAG_KEY))
  const [invoer, setInvoer] = useState('')
  const [fout, setFout] = useState('')
  const [wijzigenActief, setWijzigenActief] = useState(false)

  function verbind() {
    if (!invoer.trim()) {
      setFout('Vul eerst je sleutel in bij stap 5.')
      return
    }
    localStorage.setItem(OPSLAG_KEY, invoer.trim())
    onVerbonden()
  }

  function verwijder() {
    localStorage.removeItem(OPSLAG_KEY)
    setSleutel(null)
    setInvoer('')
    setFout('')
    setWijzigenActief(false)
  }

  // Toon gekoppeld-scherm als er al een sleutel is en niet in wijzig-modus
  if (sleutel && !wijzigenActief) {
    return (
      <div className="api-koppeling">
        <ColorSwitchKop eyebrow="Module 0" size="clamp(30px, 6vw, 46px)">
          Je AI is al gekoppeld
        </ColorSwitchKop>

        <div className="api-body">
          <p className="api-kop-tekst">
            Er is al een API-sleutel opgeslagen in je browser.
            Je kunt gewoon doorgaan met de cursus.
          </p>

          <div className="api-gekoppeld-blok">
            <span className="api-vinkje"><i className="ph-bold ph-check" aria-hidden="true" /></span>
            <div>
              <p className="api-gekoppeld-titel">Je AI is gekoppeld</p>
              <p className="api-gekoppeld-subtekst">
                Sleutel eindigt op ···{sleutel.slice(-4)}
              </p>
            </div>
          </div>

          <div className="api-gekoppeld-knoppen">
            <button
              className="secondary"
              onClick={() => setWijzigenActief(true)}
            >
              Sleutel wijzigen
            </button>
            <button
              className="secondary api-verwijder-knop"
              onClick={verwijder}
            >
              Sleutel verwijderen
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
        Koppel je AI-sleutel
      </ColorSwitchKop>

      <div className="api-body">
        <p className="api-kop-tekst">
          Om persoonlijke feedback te ontvangen heb je een gratis API-sleutel nodig.
          Volg de stappen hieronder. Het duurt ongeveer twee minuten.
        </p>

        <ol className="api-stappen">

          <li className="api-stap">
            <span className="api-stap-nummer">1</span>
            <div className="api-stap-inhoud">
              <p className="api-stap-tekst">
                Ga naar de Anthropic Console om een account aan te maken.
              </p>
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="api-extern-knop"
              >
                Naar console.anthropic.com <i className="ph-bold ph-arrow-up-right" aria-hidden="true" />
              </a>
            </div>
          </li>

          <li className="api-stap">
            <span className="api-stap-nummer">2</span>
            <div className="api-stap-inhoud">
              <p className="api-stap-tekst">
                Maak een gratis account aan met je e-mailadres.
                Je hebt geen creditcard nodig voor het gratis account.
              </p>
            </div>
          </li>

          <li className="api-stap">
            <span className="api-stap-nummer">3</span>
            <div className="api-stap-inhoud">
              <p className="api-stap-tekst">
                Ga na het inloggen naar het kopje <strong>API Keys</strong> in het linkermenu.
              </p>
            </div>
          </li>

          <li className="api-stap">
            <span className="api-stap-nummer">4</span>
            <div className="api-stap-inhoud">
              <p className="api-stap-tekst">
                Klik op <strong>Create Key</strong>, geef de sleutel een naam en kopieer hem.
              </p>
              <p className="api-stap-waarschuwing">
                Let op: je ziet de sleutel maar één keer. Kopieer hem direct.
              </p>
            </div>
          </li>

          <li className="api-stap">
            <span className="api-stap-nummer">5</span>
            <div className="api-stap-inhoud">
              <p className="api-stap-tekst">
                Plak je sleutel in het veld hieronder en klik op "Verbind AI".
              </p>
              <input
                type="password"
                className="api-invoer"
                placeholder="sk-ant-..."
                value={invoer}
                onChange={e => {
                  setInvoer(e.target.value)
                  if (fout) setFout('')
                }}
                onKeyDown={e => e.key === 'Enter' && verbind()}
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
          <button className="primary" onClick={verbind}>
            Verbind AI
          </button>
        </div>

        <p className="api-geruststelling">
          Je sleutel wordt alleen opgeslagen in jouw eigen browser en nergens anders heen gestuurd.
          Hij wordt uitsluitend gebruikt om jou feedback te geven tijdens deze cursus.
        </p>
      </div>

    </div>
  )
}
