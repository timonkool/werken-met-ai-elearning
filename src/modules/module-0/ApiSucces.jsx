import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useAnthropicApi } from '../../hooks/useAnthropicApi.js'
import ColorSwitchKop from '../../components/ColorSwitchKop.jsx'

const SYSTEEM_INSTRUCTIE =
  'Je bent een enthousiaste en warme leercoach voor een cursus over AI. ' +
  'Je spreekt de deelnemer aan met je. Je reageert altijd in het Nederlands. ' +
  'Houd je reactie kort: maximaal vier zinnen.'

const WELKOMST_BERICHT =
  'Ik heb zojuist mijn AI-sleutel gekoppeld aan de cursus Werken met AI. ' +
  'Dit is mijn eerste stap. Reageer met een oprecht en persoonlijk welkomstbericht ' +
  'en een compliment over wat ik zojuist heb bereikt.'

export default function ApiSucces({ onVolgende, onOpnieuwKoppelen }) {
  const { stuurVerzoek, laden, fout } = useAnthropicApi()
  const [welkomstTekst, setWelkomstTekst] = useState(null)
  const heeftAangevraagd = useRef(false)

  const haalWelkomstBericht = useCallback(async () => {
    const antwoord = await stuurVerzoek(WELKOMST_BERICHT, SYSTEEM_INSTRUCTIE)
    if (antwoord) setWelkomstTekst(antwoord)
  }, [stuurVerzoek])

  useEffect(() => {
    // Bewaak tegen de dubbele aanroep die React StrictMode lokaal veroorzaakt
    if (heeftAangevraagd.current) return
    heeftAangevraagd.current = true
    haalWelkomstBericht()
  }, [haalWelkomstBericht])

  return (
    <div className="api-succes">

      <ColorSwitchKop eyebrow="Module 0 · Stap 3 van 3" size="clamp(30px, 6vw, 46px)">
        Je bent er klaar voor
      </ColorSwitchKop>

      <div className="api-body">

        {/* Succesbevestiging */}
        <div className="api-succes-banner">
          <span className="api-succes-vinkje"><i className="ph-bold ph-check" aria-hidden="true" /></span>
          <p className="api-succes-tekst">Gelukt! Je hebt AI aan je cursus toegevoegd.</p>
        </div>

        {/* AI-welkomstbericht */}
        {laden && (
          <div className="api-succes-laden">
            <span className="api-succes-laden-stip" />
            <span className="api-succes-laden-stip" />
            <span className="api-succes-laden-stip" />
            <p>AI bereidt je welkomstbericht voor...</p>
          </div>
        )}

        {fout && (
          <div className="api-succes-fout">
            <p>{fout}</p>
            <div className="api-succes-fout-knoppen">
              <button className="secondary" onClick={haalWelkomstBericht}>
                Probeer opnieuw
              </button>
              {onOpnieuwKoppelen && (
                <button className="secondary" onClick={onOpnieuwKoppelen}>
                  Sleutel opnieuw koppelen
                </button>
              )}
            </div>
          </div>
        )}

        {welkomstTekst && (
          <div className="api-succes-welkom">
            <p className="api-succes-welkom-label">Je persoonlijke leercoach:</p>
            <blockquote className="api-succes-welkom-tekst">
              {welkomstTekst}
            </blockquote>
          </div>
        )}

        {/* Knop naar Module 1 */}
        {!laden && (
          <button className="primary" onClick={onVolgende}>
            Start module 1
          </button>
        )}

      </div>
    </div>
  )
}
