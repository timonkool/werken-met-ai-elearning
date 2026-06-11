import React from 'react'
import ReactMarkdown from 'react-markdown'
import Kennischeck from './Kennischeck.jsx'
import OpdrachtFeedback from './OpdrachtFeedback.jsx'

// Standaard les: theorie, kennischeck en een opdracht met AI-feedback.
// Bijzondere lessen (flyer, klikbare zinnen, twee-kolommenkaarten) worden
// gerenderd door de eigen module-componenten (Module1, Module2).
export default function LesBlok({ les }) {
  if (!les) return null

  const { theorie, kennischeck, opdracht } = les

  return (
    <article className="lesblok">
      <h2 className="lesblok-titel">{les.titel}</h2>

      {theorie && theorie.tekst && (
        <section className="theorieblok">
          <div className="theorieblok-tekst">
            <ReactMarkdown>{theorie.tekst}</ReactMarkdown>
          </div>
        </section>
      )}

      {kennischeck && <Kennischeck check={kennischeck} />}

      {opdracht && <OpdrachtFeedback lesId={les.id} opdracht={opdracht} />}
    </article>
  )
}
