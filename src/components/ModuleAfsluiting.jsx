import React from 'react'

// Afsluitblok dat onderaan een module verschijnt zodra alle lessen zijn
// afgerond: vinkje, afsluittekst uit cursus.json en de knop naar de
// volgende module. Gedeeld door module 1 t/m 4.
export default function ModuleAfsluiting({ tekst, onVolgende }) {
  return (
    <div className="module-afsluiting">
      <span className="module-afsluiting-vink"><i className="ph-bold ph-check" aria-hidden="true" /></span>
      <p className="module-afsluiting-tekst">{tekst}</p>
      <button className="primary" onClick={onVolgende}>Volgende module</button>
    </div>
  )
}
