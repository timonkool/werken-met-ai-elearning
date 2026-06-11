import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useAnthropicApi } from '../hooks/useAnthropicApi.js'
import { useVoortgang } from '../hooks/useVoortgang.js'

const AI_DISCLAIMER = 'Dit is feedback van een AI. Gebruik je eigen oordeel, AI kan zich vergissen.'

export default function LesBlok({ les }) {
  const { getLesVoortgang, setLesVoortgang } = useVoortgang()
  const { stuurVerzoek, laden, fout, kostenWaarschuwing, setKostenWaarschuwing } = useAnthropicApi()

  const lesId = les?.id

  const [antwoord, setAntwoord] = useState(() =>
    lesId ? getLesVoortgang(lesId).antwoord || '' : ''
  )
  const [afgerond, setAfgerond] = useState(() =>
    lesId ? getLesVoortgang(lesId).afgerond || false : false
  )
  const [gekozenOptie, setGekozenOptie] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [heeftVerstuurd, setHeeftVerstuurd] = useState(false)
  const [voorbeeldOpen, setVoorbeeldOpen] = useState(false)
  const [inlineFout, setInlineFout] = useState(null)

  if (!les) return null

  const { theorie, kennischeck, opdracht } = les

  async function verstuurAntwoord() {
    if (!antwoord.trim()) {
      setInlineFout('Vul eerst je antwoord in.')
      return
    }
    setInlineFout(null)

    // De beoordelingsinstructie gaat alleen als systeeminstructie mee, nooit zichtbaar in de UI.
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
    // Verberg de feedback zodat de deelnemer zijn antwoord kan herzien.
    // Het tekstveld behoudt het eerder ingevulde antwoord.
    setFeedback(null)
    setVoorbeeldOpen(false)
  }

  function markeerAfgerond() {
    setAfgerond(true)
    setLesVoortgang(lesId, { afgerond: true, antwoord })
  }

  return (
    <article className="lesblok">
      <h2 className="lesblok-titel">{les.titel}</h2>

      {/* Eenmalige kostenmelding, bovenaan, blokkeert niets */}
      {kostenWaarschuwing && (
        <div className="lesblok-kosten">
          <p>{kostenWaarschuwing}</p>
          <button className="secondary" onClick={() => setKostenWaarschuwing(null)}>
            Sluiten
          </button>
        </div>
      )}

      {/* 1. Theorieblok */}
      {theorie && theorie.tekst && (
        <section className="theorieblok">
          <div className="theorieblok-tekst">
            <ReactMarkdown>{theorie.tekst}</ReactMarkdown>
          </div>
        </section>
      )}

      {/* 2. Kennischeck */}
      {kennischeck && (
        <Kennischeck
          check={kennischeck}
          gekozen={gekozenOptie}
          onKies={setGekozenOptie}
        />
      )}

      {/* 3. Opdrachtblok + 4. Feedbackblok */}
      {opdracht && (
        <section className="opdrachtblok">
          <p className="opdrachtblok-tekst">{opdracht.tekst}</p>

          <textarea
            className="opdrachtblok-veld"
            value={antwoord}
            onChange={(e) => setAntwoord(e.target.value)}
            placeholder="Schrijf hier je antwoord..."
          />

          {inlineFout && <p className="lesblok-inline-fout">{inlineFout}</p>}

          {!feedback && (
            <button
              className="primary"
              onClick={verstuurAntwoord}
              disabled={laden}
            >
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

          {/* Feedbackblok */}
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

              <div className="feedbackblok-acties">
                <button className="secondary" onClick={pasAntwoordAan}>
                  Pas mijn antwoord aan en probeer opnieuw
                </button>
                {afgerond ? (
                  <span className="lesblok-afgerond">✓ Afgerond</span>
                ) : (
                  <button className="primary" onClick={markeerAfgerond}>
                    Markeer als afgerond
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </article>
  )
}

function Kennischeck({ check, gekozen, onKies }) {
  const beantwoord = gekozen !== null
  const goedGekozen = gekozen === check.correct

  return (
    <section className="kennischeck">
      <p className="kennischeck-vraag">{check.vraag}</p>

      <ul className="kennischeck-opties">
        {check.opties.map((optie, i) => {
          let klasse = 'kennischeck-optie'
          if (beantwoord) {
            if (i === check.correct) klasse += ' kennischeck-optie--correct'
            else if (i === gekozen) klasse += ' kennischeck-optie--fout'
          }
          return (
            <li key={i}>
              <button
                className={klasse}
                onClick={() => !beantwoord && onKies(i)}
                disabled={beantwoord}
              >
                <span className="kennischeck-optie-tekst">{optie}</span>
                {beantwoord && i === check.correct && (
                  <span className="kennischeck-vink">✓</span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {beantwoord && (
        <div className="kennischeck-uitleg">
          <p className="kennischeck-oordeel">
            {goedGekozen ? 'Goed gekozen.' : 'Net niet, maar geen probleem. Je kunt gewoon door.'}
          </p>
          <p>{check.uitleg_correct}</p>
        </div>
      )}
    </section>
  )
}
