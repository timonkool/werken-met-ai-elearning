import React, { useState } from 'react'

// Kennischeck met herkansing: bij een fout antwoord kleurt alleen de gekozen
// optie en mag de deelnemer opnieuw kiezen. Het juiste antwoord en de uitleg
// verschijnen pas na een goede keuze of na een tweede fout antwoord. Zo moet
// de deelnemer echt opnieuw nadenken in plaats van het antwoord te lezen.
// Geen blokkade: na de onthulling kan hij altijd gewoon door.
export default function Kennischeck({ check, onBeantwoord }) {
  const [foutGekozen, setFoutGekozen] = useState([])
  const [klaar, setKlaar] = useState(false)
  const [goedGekozen, setGoedGekozen] = useState(false)

  function kies(i) {
    if (klaar || foutGekozen.includes(i)) return

    if (i === check.correct) {
      setGoedGekozen(true)
      setKlaar(true)
      if (onBeantwoord) onBeantwoord(i)
      return
    }

    const nieuweFouten = [...foutGekozen, i]
    setFoutGekozen(nieuweFouten)

    // Na een tweede fout antwoord onthullen we het juiste antwoord alsnog
    if (nieuweFouten.length >= 2) {
      setKlaar(true)
      if (onBeantwoord) onBeantwoord(i)
    }
  }

  const herkansing = !klaar && foutGekozen.length > 0

  return (
    <section className="kennischeck">
      <p className="kennischeck-vraag">{check.vraag}</p>

      <ul className="kennischeck-opties">
        {check.opties.map((optie, i) => {
          let klasse = 'kennischeck-optie'
          if (foutGekozen.includes(i)) klasse += ' kennischeck-optie--fout'
          if (klaar && i === check.correct) klasse += ' kennischeck-optie--correct'
          return (
            <li key={i}>
              <button
                className={klasse}
                onClick={() => kies(i)}
                disabled={klaar || foutGekozen.includes(i)}
              >
                <span className="kennischeck-optie-tekst">{optie}</span>
                {klaar && i === check.correct && (
                  <span className="kennischeck-vink"><i className="ph-bold ph-check" aria-hidden="true" /></span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {herkansing && (
        <div className="kennischeck-uitleg">
          <p className="kennischeck-oordeel">
            Dat is hem niet. Lees de vraag nog eens en probeer opnieuw.
          </p>
        </div>
      )}

      {klaar && (
        <div className="kennischeck-uitleg">
          <p className="kennischeck-oordeel">
            {goedGekozen
              ? (foutGekozen.length > 0 ? 'Goed gekozen, bij de tweede poging.' : 'Goed gekozen.')
              : 'Net niet, maar geen probleem. Je kunt gewoon door.'}
          </p>
          <p>{check.uitleg_correct}</p>
        </div>
      )}
    </section>
  )
}
