import React from 'react'
import ColorSwitchKop from '../../components/ColorSwitchKop.jsx'

export default function Welkom({ modules, onStart }) {
  return (
    <div className="welkom">

      {/* Hero — signature kleurwissel-kop op cream */}
      <ColorSwitchKop eyebrow="E-learning · Welkom" size="clamp(38px, 8vw, 64px)">
        Werken met AI
      </ColorSwitchKop>
      <div className="welkom-hero-onder">
        <p className="welkom-lead">
          Je staat op het punt om te ontdekken hoe AI jouw werk makkelijker kan maken,
          zonder dat je technische kennis nodig hebt.
        </p>
      </div>

      {/* CTA — direct onder de koptekst zodat starten geen scrollen vereist */}
      <div className="welkom-cta">
        <button className="primary welkom-knop" onClick={onStart}>
          Start de cursus
        </button>
        <p className="welkom-cta-toelichting">
          Je vult eerst je toegangscode in. Dat duurt nog geen minuut.
        </p>
      </div>

      {/* Drie alinea's */}
      <div className="welkom-intro">
        <div className="welkom-blok">
          <h2 className="welkom-blok-titel">Wat is deze cursus?</h2>
          <p>
            Dit is een praktische cursus over het gebruik van AI op de werkvloer.
            Je leert wat AI is, hoe het werkt en hoe jij het kunt inzetten in je
            dagelijkse werk bij een stichting of vrijwilligersorganisatie.
          </p>
        </div>

        <div className="welkom-blok">
          <h2 className="welkom-blok-titel">Wat ga je doen?</h2>
          <p>
            Je doorloopt zes modules in je eigen tempo. Elke module bevat korte
            theorie, een kennischeck en een oefening met echte AI-feedback.
            Je sluit af met een persoonlijk actieplan en een certificaat.
          </p>
        </div>

        <div className="welkom-blok">
          <h2 className="welkom-blok-titel">Wat heb je nodig?</h2>
          <p>
            Alleen een computer, tablet of telefoon met internet, en de
            toegangscode die je bij deze cursus hebt gekregen. De AI-feedback
            zit ingebouwd; je hoeft zelf niets te installeren of aan te maken.
          </p>
        </div>
      </div>

      {/* Moduleoverzicht */}
      <div className="welkom-modules">
        <h2 className="welkom-modules-titel">Wat ga je leren?</h2>
        <div className="welkom-module-grid">
          {modules.map((module, index) => (
            <div key={module.id} className="welkom-module-kaart">
              <div
                className="welkom-module-kaart-streep"
                style={{ background: module.kleur }}
              />
              <div className="welkom-module-kaart-inhoud">
                <span className="welkom-module-nummer">{index}</span>
                <div>
                  <p className="welkom-module-titel">{module.titel}</p>
                  <p className="welkom-module-duur">{module.duur} min</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
