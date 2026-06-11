import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useAnthropicApi } from '../hooks/useAnthropicApi.js'
import { useVoortgang } from '../hooks/useVoortgang.js'

const AI_DISCLAIMER = 'Dit is feedback van een AI. Gebruik je eigen oordeel, AI kan zich vergissen.'

// Standaard feedbackpatroon voor opdrachten met AI-feedback. Herbruikbaar over
// alle modules. De beoordelingsinstructie gaat uitsluitend als systeeminstructie
// mee, nooit zichtbaar in de UI.
//
// Props:
// - lesId            id voor voortgangsopslag
// - opdracht         { tekst, beoordelingsinstructie, voorbeeld_antwoord }
// - nummer           optioneel opdrachtnummer; toont "Opdracht N" (alleen meegeven bij
//                    meerdere opdrachten per module), anders enkel "Opdracht"
// - inleiding        optioneel JSX boven het tekstveld (bv. de te anonimiseren situatie)
// - placeholder      optionele placeholder voor het tekstveld
// - afrondLabel      label van de afrondknop (standaard 'Markeer als afgerond')
// - onAfgerond       optionele extra actie bij afronden (bv. module voltooid markeren)
// - renderNaFeedback optioneel (feedback) => JSX, getoond na de feedback en vóór de afrondknop
export default function OpdrachtFeedback({
  lesId,
  opdracht,
  nummer = null,
  inleiding = null,
  placeholder = 'Schrijf hier je antwoord...',
  afrondLabel = 'Markeer als afgerond',
  onAfgerond,
  renderNaFeedback,
}) {
  const { getLesVoortgang, setLesVoortgang } = useVoortgang()
  const { stuurVerzoek, laden, fout, kostenWaarschuwing, setKostenWaarschuwing } = useAnthropicApi()

  const [antwoord, setAntwoord] = useState(() => getLesVoortgang(lesId).antwoord || '')
  const [afgerond, setAfgerond] = useState(() => getLesVoortgang(lesId).afgerond || false)
  const [feedback, setFeedback] = useState(null)
  const [heeftVerstuurd, setHeeftVerstuurd] = useState(false)
  const [voorbeeldOpen, setVoorbeeldOpen] = useState(false)
  const [inlineFout, setInlineFout] = useState(null)

  async function verstuurAntwoord() {
    if (!antwoord.trim()) {
      setInlineFout('Vul eerst je antwoord in.')
      return
    }
    setInlineFout(null)

    const bericht =
      `De opdracht luidde:\n${opdracht.tekst}\n\n` +
      `Dit is het antwoord van de deelnemer:\n${antwoord}`

    const resultaat = await stuurVerzoek(bericht, opdracht.beoordelingsinstructie)
    if (resultaat) {
      setFeedback(resultaat)
      setHeeftVerstuurd(true)
      setLesVoortgang(lesId, { afgerond, antwoord })
    }
  }

  function pasAntwoordAan() {
    setFeedback(null)
    setVoorbeeldOpen(false)
  }

  function markeerAfgerond() {
    setAfgerond(true)
    setLesVoortgang(lesId, { afgerond: true, antwoord })
    if (onAfgerond) onAfgerond()
  }

  return (
    <section className="opdrachtblok">
      <h3 className="opdrachtblok-kop">Opdracht{nummer ? ` ${nummer}` : ''}</h3>

      {/* Eenmalige kostenmelding, blokkeert niets */}
      {kostenWaarschuwing && (
        <div className="lesblok-kosten">
          <p>{kostenWaarschuwing}</p>
          <button className="secondary" onClick={() => setKostenWaarschuwing(null)}>
            Sluiten
          </button>
        </div>
      )}

      <p className="opdrachtblok-tekst">{opdracht.tekst}</p>

      {inleiding}

      <textarea
        className="opdrachtblok-veld"
        value={antwoord}
        onChange={(e) => setAntwoord(e.target.value)}
        placeholder={placeholder}
      />

      {inlineFout && <p className="lesblok-inline-fout">{inlineFout}</p>}

      {!feedback && (
        <button className="primary" onClick={verstuurAntwoord} disabled={laden}>
          Verstuur en ontvang feedback
        </button>
      )}

      {laden && (
        <div className="lesblok-laden">
          <span className="lesblok-laden-stip" />
          <span className="lesblok-laden-stip" />
          <span className="lesblok-laden-stip" />
          <p>AI leest je antwoord...</p>
        </div>
      )}

      {fout && (
        <div className="lesblok-fout">
          <p>{fout}</p>
          <button className="secondary" onClick={verstuurAntwoord}>
            Probeer opnieuw
          </button>
        </div>
      )}

      {feedback && (
        <div className="feedbackblok">
          <p className="feedbackblok-label">Feedback van je leercoach</p>
          <div className="feedbackblok-tekst">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>

          <p className="feedbackblok-disclaimer">{AI_DISCLAIMER}</p>

          {/* Voorbeeldantwoord, pas beschikbaar na versturen, nooit automatisch open */}
          {heeftVerstuurd && opdracht.voorbeeld_antwoord && (
            <div className="voorbeeld">
              <button
                className="voorbeeld-knop"
                onClick={() => setVoorbeeldOpen((open) => !open)}
              >
                {voorbeeldOpen ? 'Verberg het voorbeeldantwoord' : 'Bekijk een voorbeeldantwoord'}
              </button>
              {voorbeeldOpen && (
                <div className="voorbeeld-tekst">
                  <ReactMarkdown>{opdracht.voorbeeld_antwoord}</ReactMarkdown>
                </div>
              )}
            </div>
          )}

          {renderNaFeedback && renderNaFeedback(feedback)}

          <div className="feedbackblok-acties">
            <button className="secondary" onClick={pasAntwoordAan}>
              Pas mijn antwoord aan en probeer opnieuw
            </button>
            {afgerond ? (
              <span className="lesblok-afgerond">✓ Afgerond</span>
            ) : (
              <button className="primary" onClick={markeerAfgerond}>
                {afrondLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
