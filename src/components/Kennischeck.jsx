import React, { useState } from 'react'

// Standaard kennischeckpatroon: bij een juist antwoord groen vinkje + juiste optie
// groen, bij een fout antwoord de gekozen optie gedempt oranje en het juiste antwoord
// groen. Geen blokkade: de deelnemer ziet de correctie en kan direct door.
export default function Kennischeck({ check, onBeantwoord }) {
  const [gekozen, setGekozen] = useState(null)
  const beantwoord = gekozen !== null
  const goedGekozen = gekozen === check.correct

  function kies(i) {
    if (beantwoord) return
    setGekozen(i)
    if (onBeantwoord) onBeantwoord(i)
  }

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
                onClick={() => kies(i)}
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
